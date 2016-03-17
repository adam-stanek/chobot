'use strict';
const { createFluent } = require('@dobby/fluent');
const deepEqual = require('deep-equal');

function dictType(t, dictionary) {
  t.replaceFilter((input) => {
    if(!input)
      return null;

    var m;
    for(var k in dictionary) {
      if(input.value.lastIndexOf(k, 0) === 0 && (!m || m.length < k.length))
        m = k;
    }

    return m ? { matchedString: m, value: dictionary[m] } : null;
  });

  // TODO: can we use some sort of hashing algorithm?
  // WeakMap is not much help if we don't have the ability to compare by object equality instead of identity
  t.replaceFormatter((value) => {
    for(var k in dictionary) {
      if(deepEqual(dictionary[k], value))
        return k;
    }

    return null;
  });
}

module.exports = (SharedMethods) => createFluent(
  [dictType],
  SharedMethods
);
