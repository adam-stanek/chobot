'use strict';
const { createFluent } = require('@dobby/fluent');

const INTEGER_RX = /-?[0-9]+/;
function integerType(t) {
  t.replaceFilter((m) => {
    if(m && m.matchedString) {
      let matches = INTEGER_RX.exec(m.matchedString);
      if(matches && m.matchedString.indexOf(matches[0]) === 0) {
        return { matchedString: matches[0], value: parseInt(matches[0]) };
      }
    }

    return null;
  });

  t.replaceFormatter((n) => Math.floor(n) + '');
}

module.exports = (SharedMethods) => createFluent(
  [integerType],
  Object.assign({}, SharedMethods, {
    gt:  (t, min) => t.chainFilter((m) => m && m.value >  min ? m : null),
    gte: (t, min) => t.chainFilter((m) => m && m.value >= min ? m : null),
    lt:  (t, max) => t.chainFilter((m) => m && m.value <  max ? m : null),
    lte: (t, max) => t.chainFilter((m) => m && m.value <= max ? m : null)
  })
);
