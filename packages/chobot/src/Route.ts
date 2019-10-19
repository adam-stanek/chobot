import { BaseParamType } from './paramTypes/BaseParamType'
import { buildParamDescriptors } from './paramTypes/buildParamDescriptors'
import { ParamDescriptor } from './paramTypes/ParamDescriptor'
import { match } from './utils/match'
import { MatchingNode } from './utils/MatchingNode'
import { parsePathExpression } from './utils/parsePathExpression'

function matchRouteList(routes: Route[], pathname: string, index: number): PathnameMatch | false {
  if ((index == 0 || pathname[index - 1] != '/') && pathname[index] == '/') index++

  let m: PathnameMatch | false
  for (var i = 0; i < routes.length; i++) {
    m = routes[i].matchPathname(pathname, index)
    if (m) return m
  }

  return false
}

function assignDefaults(obj: { [k: string]: any }, paramTypes: { [k: string]: ParamDescriptor }) {
  for (var k in paramTypes) {
    if (paramTypes[k].defaultValue !== undefined && obj[k] === undefined)
      obj[k] = paramTypes[k].defaultValue
  }
}

export interface RouteOptions {
  name?: string
  path?: string
  params?: { [k: string]: BaseParamType<any> }
  queryParams?: { [k: string]: BaseParamType<any> }
  children?: Route[]
}

export interface PathnameMatch {
  params: { [k: string]: any }
  routes: Route[]
}

export interface LocationMatch extends PathnameMatch {
  queryParams: { [k: string]: any }
}

/**
 * Route implementation.
 */
export class Route {
  name?: string
  children: Route[]

  path?: string
  matchingTree?: MatchingNode[]

  params: { [k: string]: ParamDescriptor }
  queryParams: { [k: string]: ParamDescriptor }

  /**
   * Constructor.
   * @param  {object}  opts    route properties
   * @param  {string}  [opts.path] path fragment used for matching
   * @param  {string}  [opts.name] route name used for creating links
   * @param  {object}  [opts.params] parameter types
   * @param  {object}  [opts.queryParams] query parameter types
   * @param  {Route[]} [opts.children] children child routes
   */
  constructor({ name, path, children = [], params, queryParams }: RouteOptions) {
    this.name = name
    this.path = path
    this.children = children
    this.params = params ? buildParamDescriptors(params) : {}
    this.queryParams = queryParams ? buildParamDescriptors(queryParams) : {}

    // Parse 'path' expression into matching tree
    if (path != '.') {
      this.matchingTree = path == undefined || path == '' ? [] : parsePathExpression(path)
    }

    if (path == '.' && children.length > 0)
      throw new Error('Index routes cannot have any children.')
  }

  /**
   * Matches location against the route (and its children).
   * @param  {object} location
   * @param  {string} location.pathname URL path
   * @param  {string} location.search URL search path (serialized query parameters starting with ?)
   * @param  {number} index=0 starting index from which is the pathname being matched
   * @return {MatchedRouteInfo|false} route match or false if route doesn't match the location
   */
  match(location: { pathname: string; search?: string }, index = 0) {
    var result = this.matchPathname(location.pathname, index) as LocationMatch | false
    if (result && location.search) {
      result.queryParams = location.search
        .substring(1)
        .split('&')
        .reduce(
          (queryParams, pair) => {
            var equalsIdx = pair.indexOf('=')
            let k = decodeURIComponent(equalsIdx === -1 ? pair : pair.substr(0, equalsIdx))
            var v = equalsIdx === -1 ? '' : decodeURIComponent(pair.substr(equalsIdx + 1))

            if (k.endsWith('[]')) {
              k = k.substr(0, k.length - 2)
              if (Array.isArray(queryParams[k])) {
                ;(queryParams[k] as string[]).push(v)
              } else {
                queryParams[k] = [v]
              }
            } else {
              queryParams[k] = v
            }

            return queryParams
          },
          {} as { [k: string]: string | string[] },
        )

      // Apply param filters
      for (var k in result.queryParams) {
        for (var filterResult, i = result.routes.length - 1; i >= 0; i--) {
          if (result.routes[i].queryParams && result.routes[i].queryParams[k]) {
            filterResult = result.routes[i].queryParams[k].filter(result.queryParams[k])
            if (filterResult) {
              result.queryParams[k] = filterResult.value
              break
            } else {
              return false
            }
          }
        }
      }
    }

    return result
  }

  /**
   * Matches location against the route (and its children).
   * @param  {string} pathname URL path
   * @param  {number} index=0 starting index from which is the pathname being matched
   * @return {MatchedRouteInfo|false} route match or false if route doesn't match the location
   */
  matchPathname(pathname: string, index = 0): PathnameMatch | false {
    var result: PathnameMatch = {
      params: {},
      routes: [this],
    }

    // If we are the index route
    if (this.path === '.') {
      if (pathname.length == index || (pathname.length == index + 1 && pathname[index] == '/')) {
        if (this.params) {
          assignDefaults(result.params, this.params)
        }
        return result
      } else {
        return false
      }
    }

    // Match against matching tree
    else {
      let m = match(pathname, this.matchingTree!, this.params, index)
      // console.log('matching', pathname.substring(index), 'against', this.path, ' => ', m);

      if (m.length == 0) return false

      // Match from the worst rank
      // (we prefer matched child routes over optional fragments)
      for (var i = m.length - 1; i >= 0; i--) {
        // Process child routes
        if (this.children.length) {
          let childMatches = matchRouteList(this.children, pathname, m[i].matchedLength + index)
          if (childMatches) {
            Object.assign(result.params, m[i].params, childMatches.params)
            if (this.params) {
              assignDefaults(result.params, this.params)
            }
            result.routes.push(...childMatches.routes)
            return result
          }
        }

        // Leaf route
        else {
          // If we are at the end of the path and we are leaf route => END
          if (
            m[i].matchedLength + index === pathname.length ||
            (pathname.length == m[i].matchedLength + index + 1 &&
              pathname[m[i].matchedLength + index] == '/')
          ) {
            Object.assign(result.params, m[i].params)
            if (this.params) {
              assignDefaults(result.params, this.params)
            }
            return result
          }
        }
      }
    }

    return false
  }
}
