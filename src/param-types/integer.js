'use strict';
const { createFluent } = require('@dobby/fluent');

const INTEGER_RX = /-?[0-9]+/;
function integerType(t) {
  t.replaceFilter((str) => {
    var m = INTEGER_RX.exec(str);
    if(m && str.indexOf(m[0]) === 0) {
      var value = parseInt(m[0]);
      return { matchedString: m[0], value };
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
