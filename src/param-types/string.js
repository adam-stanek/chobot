'use strict';
const { createFluent } = require('@dobby/fluent');
const regExpFilter = require('../utils/regExpFilter.js');

function rx(t, regExp) {
  t.chainFilter(regExpFilter(regExp));
}

module.exports = (SharedMethods) => createFluent(
  [],
  Object.assign({}, SharedMethods, {
    rx
  })
);
