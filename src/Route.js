'use strict';

const parsePathExpression = require('./utils/parsePathExpression.js');
const match = require('./utils/match.js');
const ensureRoute = require('./utils/ensureRoute.js');
const { composeChain } = require('@dobby/fluent');
const { ParamType } = require('./ParamType.js');

function matchRouteList(routes, pathname, index) {
  if((index == 0 || pathname[index - 1] != '/') && pathname[index] == '/')
    index++;

  var m;
  for(var i = 0; i < routes.length; i++) {
    m = routes[i].matchPathname(pathname, index);
    if(m)
      return m;
  }

  return false;
}

function assignDefaults(obj, paramTypes) {
  for(var k in paramTypes) {
    if(paramTypes[k].defaultValue !== undefined && obj[k] === undefined)
      obj[k] = paramTypes[k].defaultValue;
  }
}

/**
 * Matched route info.
 * @typedef {Object} MatchedRouteInfo
 * @property {Object<string, mixed>} params dictionary of extracted parameters
 * @property {Array.<Route>} routes matched route sequence (from the root to the leaf)
 */

const PARAM_KEYS = ['params', 'queryParams']

/**
 * Route implementation.
 */
class Route {

  /**
   * Constructor.
   * @param  {object}  props    route properties
   * @param  {string}  [props.path] path fragment used for matching
   * @param  {string}  [props.name] route name used for creating links
   * @param  {object}  [props.params] parameter types
   * @param  {Route[]} children child routes
   */
  constructor(props, children) {
    for(var k in props)
      this[k] = props[k];

    this.children = children.map((child) => ensureRoute(Route, child));

    // Parse 'path' expression into matching tree
    if(props.path != '.')
      this.matchingTree = props.path == undefined || props.path == '' ? [] : parsePathExpression(props.path);

    PARAM_KEYS.forEach(paramKey => {
      if(this[paramKey]) {
        this[paramKey] = Object.assign({}, this[paramKey])
        for(var k in this[paramKey]) {
          if(this[paramKey][k] && (typeof this[paramKey][k] === 'object' || typeof this[paramKey][k] === 'function') && this[paramKey][k].__chain) {
            this[paramKey][k] = composeChain(new ParamType, this[paramKey][k].__chain);
          }
        }
      } else {
        this[paramKey] = {};
      }
    })

    if(props.path == '.' && children.length > 0)
      throw new Error('Index routes cannot have any children.');
  }

  /**
  * Matches location against the route (and its children).
  * @param  {object} location
  * @param  {string} location.pathname URL path
  * @param  {string} location.search URL search path (serialized query parameters starting with ?)
  * @param  {number} index=0 starting index from which is the pathname being matched
  * @return {MatchedRouteInfo|false} route match or false if route doesn't match the location
  */
  match(location, index = 0) {
    var result = this.matchPathname(location.pathname, index = 0)
    if(result && location.search) {
      result.queryParams = location.search.substring(1).split('&').reduce(
        (queryParams, pair) => {
          var equalsIdx = pair.indexOf('=')
          var k = decodeURIComponent(equalsIdx === -1 ? pair : pair.substr(0, equalsIdx))
          var v = equalsIdx === -1 ? "" : decodeURIComponent(pair.substr(equalsIdx + 1))

          if(k.endsWith('[]')) {
            k = k.substr(0, k.length - 2)
            if(!Array.isArray(queryParams[k])) {
              queryParams[k] = [v]
            } else {
              queryParams[k].push(v)
            }
          } else {
            queryParams[k] = v
          }

          return queryParams
        },
        {} /* as { [k: string]: string | string[] } */
      )

      // Apply param filters
      for(var k in result.queryParams) {
        for(var filterResult, i = result.routes.length - 1; i >= 0; i--) {
          if(result.routes[i].queryParams && result.routes[i].queryParams[k]) {
            filterResult = result.routes[i].queryParams[k].filter(result.queryParams[k])
            if(filterResult) {
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
  matchPathname(pathname, index = 0) {
    var result = {
      params: {},
      routes: [ this ]
    };

    // If we are the index route
    if(this.path === '.') {
      if(pathname.length == index || (pathname.length == index + 1 && pathname[index] == '/')) {
        assignDefaults(result.params, this.params);
        return result;
      } else {
        return false;
      }
    }

    // Match against matching tree
    else {
      let m = match(pathname, this.matchingTree, this.params, index);
      // console.log('matching', pathname.substring(index), 'against', this.path, ' => ', m);

      if(m.length == 0)
        return false;

      // Match from the worst rank
      // (we prefer matched child routes over optional fragments)
      for(var i = m.length - 1; i >= 0; i--) {

        // Process child routes
        if(this.children.length) {
          let childMatches = matchRouteList(this.children, pathname, m[i].matchedLength + index);
          if(childMatches) {
            Object.assign(result.params, m[i].params, childMatches.params);
            assignDefaults(result.params, this.params);
            result.routes.push(...childMatches.routes);
            return result;
          }
        }

        // Leaf route
        else {
          // If we are at the end of the path and we are leaf route => END
          if(m[i].matchedLength + index === pathname.length || (pathname.length == m[i].matchedLength + index + 1 && pathname[m[i].matchedLength + index] == '/')) {
            Object.assign(result.params, m[i].params);
            assignDefaults(result.params, this.params);
            return result;
          }
        }
      }
    }

    return false;
  }
}

module.exports = Route;
