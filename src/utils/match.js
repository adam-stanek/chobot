'use strict';
const { DEFAULT_FILTER } = require('../ParamType.js');

// Matcher
function match(str, matchingTree, paramTypes = {}, strIndex = 0, treeIndex = 0) {
  var params = {};

  for(var i = treeIndex; i < matchingTree.length; i++) {
    // Fixed string
    if(matchingTree[i].s) {
      // If string starts at the index we move the index by substring length
      // If not we are in the dead end.
      if(str.lastIndexOf(matchingTree[i].s, strIndex) == strIndex)
        strIndex += matchingTree[i].s.length;
      else
        return false;
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
      } else
        return false;
    }

    // Optional fragment
    else if(matchingTree[i].o) {
      // Try to match the optional subtree
      let m = match(str, matchingTree[i].o, paramTypes, strIndex, 0);
      if(m) {
        let params2 = Object.assign({}, params, m.params);

        // If we have match we check if we can continue with the rest.
        // If we can, we have a match.
        m = match(str, matchingTree, paramTypes, m.index, i + 1);
        if(m) {
          for(let k in m.params)
            params2[k] = m.params[k];

          m.params = params2;
          return m;
        }
      }
    }
  }

  return { index: strIndex, params };
}

module.exports = match;
