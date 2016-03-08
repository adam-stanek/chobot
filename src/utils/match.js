'use strict';
const { DEFAULT_FILTER } = require('../ParamType.js');

// Matcher
function match(str, matchingTree, paramTypes = {}, strIndex = 0, treeIndex = 0) {
  var params = {};

  for(var i = treeIndex; i < matchingTree.length; i++) {
    if(matchingTree[i].s) {
      if(str.indexOf(matchingTree[i].s, strIndex) == strIndex)
        strIndex += matchingTree[i].s.length;
      else
        return false;

    } else if(matchingTree[i].p) {
      let f = (paramTypes[matchingTree[i].p] ? paramTypes[matchingTree[i].p].filter : DEFAULT_FILTER)(strIndex > 0 ? str.substring(strIndex) : str);
      if(f) {
        params[matchingTree[i].p] = f.value;
        strIndex += f.matchedString.length;
      } else
        return false;
    } else if(matchingTree[i].o) {
      let m = match(str, matchingTree[i].o, paramTypes, strIndex, 0);
      if(m) {
        let params2 = Object.assign({}, params, m.params);
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
