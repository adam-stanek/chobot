'use strict';
const Route = require('./Route.js');
const constructFragmentForParams = require('./utils/constructFragmentForParams.js');

module.exports = class Router {
  constructor(routes) {
    this.rootRoute = new Route({}, routes);
  }

  // Zero-copy generator
  *routeWalk() {
    var top;
    var routeStack = [];
    var indexStack = [];

    for(var i = 0; i < this.rootRoute.children.length; i++) {
      routeStack.push(this.rootRoute.children[i]);
      yield routeStack;

      indexStack.push(0);
      top = 0;

      while(top > -1) {
        if(routeStack[top].children[indexStack[top]]) {
          routeStack.push(routeStack[top].children[indexStack[top]]);
          yield routeStack;

          if(routeStack[top].children[indexStack[top]].children.length > 0) {
            indexStack.push(0);
            indexStack[top]++;
            top++;
          } else {
            routeStack.pop();
            indexStack[top]++;
          }

        } else {
          routeStack.pop();
          indexStack.pop();
          top--;
        }
      }
    }
  }

  createPathFromRoutes(routes, params) {
    var fragment;

    var result = {
      pathname: '',
      matchedParams: [],
      defaults: {}
    };

    routes.forEach((r) => {
      for(let k in r.params) {
        if(r.params[k].defaultValue !== undefined)
          result.defaults[k] = r.params[k].defaultValue;
      }

      if(r.matchingTree) {
        // @throws string error
        fragment = constructFragmentForParams(
          r.matchingTree,
          params,
          r.params
        );

        result.matchedParams.push(...fragment.matchedParams);

        if(fragment.fragment.length > 0) {
          if(fragment.fragment[0] != '/' && (result.pathname.length == 0 || result.pathname[result.pathname.length - 1] != '/'))
            result.pathname += '/';

          result.pathname += fragment.fragment;
        }
      }
    });

    if(routes[routes.length - 1].path == '.' && result.pathname[result.pathname.length - 1] != '/')
      result.pathname += '/';

    return result;
  }

  createUrl(name, params = {}, hash) {
    var bestMatch, match;

    for(let routes of this.routeWalk()) {
      if(routes[routes.length - 1].name == name) {
        try {
          match = this.createPathFromRoutes(routes, params);
          if(match && (!bestMatch || bestMatch.matchedParams.length < match.matchedParams.length)) {
            bestMatch = match;
          }

        // We need to ignore errors of missing parameters and rethrow anything else
        } catch(e) {
          if(typeof e !== 'string')
            throw e;
        }
      }
    }

    if(!bestMatch)
      return false;

    var url = bestMatch.pathname;
    var queryPairs = [];
    for(let k in params) {
      if(params[k] !== bestMatch.defaults[k] && bestMatch.matchedParams.indexOf(k) == -1) {
        queryPairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
      }
    }

    if(queryPairs.length)
      url += '?' + queryPairs.join('&')

    if(hash)
      url += '#' + hash;

    return url;
  }
}
