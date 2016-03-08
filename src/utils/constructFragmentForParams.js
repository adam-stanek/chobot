'use strict';
const deepEqual = require('deep-equal');
const isOptionalForParams = require('./isOptionalForParams.js');
const { DEFAULT_FORMATTER } = require('../ParamType.js');

/**
 * Optional part of an matching sequence.
 * @typedef {Object} ConstructedFragment
 * @property {string} fragment URL fragment
 * @property {string[]} matchedParams list of matched params in that fragment
 */

/**
 * Construct URL fragment for given set of params.
 * @param  {MatcherSequence} matchingTree
 * @param  {Object} params parameter values
 * @param  {Object} paramTypes parameter types
 * @return {ConstructedFragment}
 * @throws Will throw an error if no value is provided for required parameter.
 */
function constructFragmentForParams(matchingTree, params, paramTypes) {
  var result = {
    fragment: '',
    matchedParams: []
  };

  var v;
  var defaultValue;

  for(var i = 0; i < matchingTree.length; i++) {
    if(matchingTree[i].s)
      result.fragment += matchingTree[i].s;
    else if(matchingTree[i].p) {
      result.matchedParams.push(matchingTree[i].p);
      defaultValue = paramTypes[matchingTree[i].p] ? paramTypes[matchingTree[i].p].defaultValue : undefined;

      if(matchingTree[i].p in params) {
        if(!deepEqual(params[matchingTree[i].p], defaultValue)) {
          v = (paramTypes[matchingTree[i].p] ? paramTypes[matchingTree[i].p].format : DEFAULT_FORMATTER)(params[matchingTree[i].p]);
          if(v !== null)
            result.fragment += v;
          else
            throw `Invalid value for parameter ${matchingTree[i].p}.`;
        }
      }
      else if(defaultValue === undefined)
        throw `Missing value for parameter ${matchingTree[i].p}.`;  // intentionally not Error instance

    } else if(!isOptionalForParams(matchingTree[i], params, paramTypes)) {
      let r2 = constructFragmentForParams(matchingTree[i].o, params, paramTypes);
      result.fragment += r2.fragment;
      result.matchedParams.push(...r2.matchedParams);
    }
  }

  return result;
}

module.exports = constructFragmentForParams;
