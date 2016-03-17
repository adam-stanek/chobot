/**
 * Determine if fragment is optional for given set of params
 * @param  {MatcherAny}  matchingNode
 * @param  {Object}  params
 * @param  {Object}  paramTypes
 * @return {Boolean}
 */
function isOptionalForParams(matchingNode, params, paramTypes) {
  if(matchingNode.s)
    return true;

  if(matchingNode.p) {
    var defaultValue = paramTypes[matchingNode.p] ? paramTypes[matchingNode.p].defaultValue : undefined;
    return params[matchingNode.p] === undefined || params[matchingNode.p] === defaultValue;
  }

  if(matchingNode.o) {
    for(var i = 0; i < matchingNode.o.length; i++) {
      if(!isOptionalForParams(matchingNode.o[i], params, paramTypes))
        return false;
    }

    return true;
  }
}

module.exports = isOptionalForParams;
