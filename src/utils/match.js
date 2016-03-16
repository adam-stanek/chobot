'use strict';
const { DEFAULT_FILTER } = require('../ParamType.js');

// Matcher
function match(str, matchingTree, paramTypes = {}, strIndex = 0, treeIndex = 0, rank = 0) {
  var params = {};
  var matches = [];

  for(var i = treeIndex; i < matchingTree.length; i++) {
    // Fixed string
    if(matchingTree[i].s) {
      // If string starts at the index we move the index by substring length
      // If not we are in the dead end.
      if(str.lastIndexOf(matchingTree[i].s, strIndex) == strIndex) {
        strIndex += matchingTree[i].s.length;
        rank++;
      } else
        return matches;
    }

    // Parameter
    else if(matchingTree[i].p) {
      // Try to apply parameter filter
      let f = (paramTypes[matchingTree[i].p] ? paramTypes[matchingTree[i].p].filter : DEFAULT_FILTER)(strIndex > 0 ? str.substring(strIndex) : str);

      // Is parameter valid?
      // If so we move the index by matched length.
      // If not we are in the dead end.
      if(f) {
        params[matchingTree[i].p] = f.value;
        strIndex += f.matchedString.length;
        rank++;
      } else
        return matches;
    }

    // Optional fragment
    else if(matchingTree[i].o) {
      // Try to match the optional subtree
      let m = match(str, matchingTree[i].o, paramTypes, strIndex, 0, rank);

      // For each subtree match check if we can continue with it
      for(var j = 0; j < m.length; j++) {
        let params2 = Object.assign({}, params, m[j].params);

        let m2 = match(str, matchingTree, paramTypes, m[j].matchedLength, i + 1, m[j].rank);
        for(var k = 0; k < m2.length; k++) {
          matches.push({
            matchedLength: m2[k].matchedLength,
            rank: m2[k].rank,
            params: Object.assign({}, params2, m2[k].params)
          });
        }
      }
    }
  }

  matches.push({
    matchedLength: strIndex,
    rank,
    params
  });

  return matches;
}

module.exports = match;
