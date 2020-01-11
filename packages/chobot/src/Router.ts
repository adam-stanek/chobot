import { Route } from './Route'
import { constructFragmentForParams } from './utils/constructFragmentForParams'
import { routeWalk } from './utils/routeWalk'

export interface ConstructedPath {
  pathname: string
  matchedParams: string[]
  defaults: { [k: string]: any }
}

export class Router<TRoute extends Route = Route> {
  public rootRoute: TRoute

  constructor(route: TRoute) {
    this.rootRoute = route
  }

  createPathFromRoutes(routes: TRoute[], params: { [k: string]: any }): ConstructedPath {
    var fragment

    var result: ConstructedPath = {
      pathname: '',
      matchedParams: [],
      defaults: {},
    }

    routes.forEach(r => {
      for (let k in r.params) {
        if (r.params[k].defaultValue !== undefined) result.defaults[k] = r.params[k].defaultValue
      }

      if (r.matchingTree) {
        // @throws string error
        fragment = constructFragmentForParams(r.matchingTree, params, r.params)

        result.matchedParams.push(...fragment.matchedParams)

        if (fragment.fragment.length > 0) {
          if (
            fragment.fragment[0] != '/' &&
            (result.pathname.length == 0 || result.pathname[result.pathname.length - 1] != '/')
          )
            result.pathname += '/'

          result.pathname += fragment.fragment
        }
      }
    })

    if (routes[routes.length - 1].path == '.' && result.pathname[result.pathname.length - 1] != '/')
      result.pathname += '/'

    return result
  }

  createUrl(name: string, params: { [k: string]: any } = {}, hash?: string) {
    let bestMatch: ConstructedPath | undefined
    let bestMatchRoutes: Route[]
    let match: ConstructedPath | undefined

    for (let routes of routeWalk([this.rootRoute])) {
      if (routes[routes.length - 1].name == name) {
        try {
          match = this.createPathFromRoutes(routes, params)
          if (
            match &&
            (!bestMatch || bestMatch.matchedParams.length < match.matchedParams.length)
          ) {
            bestMatch = match
            bestMatchRoutes = routes
          }

          // We need to ignore errors of missing parameters and rethrow anything else
        } catch (e) {
          if (typeof e !== 'string') throw e
        }
      }
    }

    if (!bestMatch) return false

    var url = bestMatch.pathname
    var queryPairs = []

    for (let k in params) {
      if (params[k] !== bestMatch.defaults[k] && bestMatch.matchedParams.indexOf(k) == -1) {
        var value = params[k]
        for (var i = bestMatchRoutes!.length - 1; i >= 0; i--) {
          if (bestMatchRoutes![i].queryParams && bestMatchRoutes![i].queryParams[k]) {
            value = bestMatchRoutes![i].queryParams[k].format(value)
            break
          }
        }

        var encodedKey = encodeURIComponent(k)
        if (Array.isArray(value)) {
          value.forEach(v => queryPairs.push(encodedKey + '%5B%5D=' + encodeURIComponent(v)))
        } else {
          queryPairs.push(encodedKey + '=' + encodeURIComponent(value))
        }
      }
    }

    if (queryPairs.length) url += '?' + queryPairs.join('&')

    if (hash) url += '#' + hash

    return url
  }
}
