'use strict';

const parsePathExpression = require('./utils/parsePathExpression.js');
const match = require('./utils/match.js');
const ensureRoute = require('./utils/ensureRoute.js');
const { composeChain } = require('@dobby/fluent');
const { ParamType } = require('./ParamType.js');

function matchRouteList(routes, location, index) {
  if((index == 0 || location.pathname[index - 1] != '/') && location.pathname[index] == '/')
    index++;

  var m;
  for(var i = 0; i < routes.length; i++) {
    m = routes[i].match(location, index);
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

/**
 * Route implementation.
 */
class Route {

  /**
   * Constructor.
   * @param  {object}  props    route properties
   * @param  {string}  [props.path] path fragment used for matching
   * @param  {string}  [props.name] route name used for creating links
   * @param  {string}  [props.params] parameter types
   * @param  {Route[]} children child routes
   */
  constructor(props, children) {
    for(var k in props)
      this[k] = props[k];

    this.children = children.map((child) => ensureRoute(Route, child));

    // Parse 'path' expression into matching tree
    if(props.path != '.')
      this.matchingTree = props.path == undefined || props.path == '' ? [] : parsePathExpression(props.path);

    // TODO: add support for directly passed types
    if(this.params) {
      for(var k in this.params) {
        if(!(this.params[k] instanceof ParamType))
          this.params[k] = composeChain(new ParamType, this.params[k].__chain);
      }
    } else {
      this.params = {};
    }

    if(props.path == '.' && children.length > 0)
      throw new Error('Index routes cannot have any children.');
  }

  /**
   * Matches location against the route (and its children).
   * @param  {object} location
   * @param  {string} location.pathname URL path
   * @param  {number} index=0 starting index from which is the pathname being matched
   * @return {MatchedRouteInfo|false} route match or false if route doesn't match the location
   */
  match(location, index = 0) {
    var result = {
      params: {},
      routes: [ this ]
    };

    // If we are the index route
    if(this.path === '.') {
      if(location.pathname.length == index || (location.pathname.length == index + 1 && location.pathname[index] == '/')) {
        assignDefaults(result.params, this.params);
        return result;
      } else {
        return false;
      }
    }

    // Match against matching tree
    else {
      let m = match(location.pathname, this.matchingTree, this.params, index);
      // console.log('matching', location.pathname.substring(index), 'against', this.path, ' => ', m);

      if(m.length == 0)
        return false;

      // Match from the worst rank
      // (we prefer matched child routes over optional fragments)
      for(var i = m.length - 1; i >= 0; i--) {

        // Process child routes
        if(this.children.length) {
          let childMatches = matchRouteList(this.children, location, m[i].matchedLength + index);
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
          if(m[i].matchedLength + index === location.pathname.length || (location.pathname.length == m[i].matchedLength + index + 1 && location.pathname[m[i].matchedLength + index] == '/')) {
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
