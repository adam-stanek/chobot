'use strict';

const parsePathExpression = require('./utils/parsePathExpression.js');
const match = require('./utils/match.js');
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

function merge(params, ...otherParams) {
  otherParams.forEach((p) => {
    if(p) {
      for(let k in p)
        params[k] = p[k];
    }
  })
}

function applyDefaults(params, defaults) {
  if(defaults) {
    for(let k in defaults) {
      if(params[k] === undefined)
        params[k] = defaults[k];
    }
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

    this.children = children;

    // Parse 'path' expression into matching tree
    this.matchingTree = props.path == undefined || props.path == '' || props.path == '.' ? null : parsePathExpression(props.path);

    // TODO: add support for directly passed types
    if(this.params) {
      for(var k in this.params) {
        this.params[k] = composeChain(new ParamType, this.params[k].__chain);
      }
    } else {
      this.params = {};
    }

    // Are all matching rules optional?
    this.isOptional = this.matchingTree && this.matchingTree.every((rule) => rule.o);

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

    // Match against matching tree
    if(this.matchingTree) {
      let m = match(location.pathname, this.matchingTree, this.params, index);
      if(m) {
        // If we are at the end of the path and we have are leaf route => END
        if(m.index == location.pathname.length && this.children.length === 0) {
          merge(result.params, m.params);
          applyDefaults(result.params, this.defaults);
          return result;
        }

        // Match children routes if we have any.
        // If we have match we simply return it. If we doesn't we try to continue
        // without matched path expression.
        if(this.children) {
          let childMatches = matchRouteList(this.children, location, m.index);
          if(childMatches) {
            merge(result.params, m.params, childMatches.params);
            applyDefaults(result.params, this.defaults);
            result.routes.push(...childMatches.routes);
            return result;
          }
        }
      }

      // If we are here, it means that location didn't pass the matching tree.
      // If any of the path expression is required, we are done, otherwise
      // we continue skipping this route path expression completely.
      if(!this.isOptional)
        return false;
    }

    // Match index routes
    else if(this.path == '.') {
      if(location.pathname.length == index || (location.pathname.length == index + 1 && location.pathname[index] == '/')) {
        applyDefaults(result.params, this.defaults);
        return result;
      } else {
        return false;
      }
    }

    // If we got here it means that we skipped path matching of this route
    // => continue to children routes.
    if(this.children) {
    let childMatches = matchRouteList(this.children, location, index);
      if(childMatches) {
        merge(result.params, childMatches.params);
        applyDefaults(result.params, this.defaults);
        result.routes.push(...childMatches.routes);
      } else if(index != location.pathname.length)
        return false;
    }

    return result;
  }
}

module.exports = Route;
