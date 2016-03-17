'use strict';
const { createFluent } = require('@dobby/fluent');
const regExpFilter = require('../utils/regExpFilter.js');
const { DEFAULT_FILTER } = require('../ParamType.js');

function keywordsType(t) {
  t.replaceFilter((str) => {
    var m = DEFAULT_FILTER(str);
    if(m) {
      m.value = m.value.split('--').map((s) => s.replace(/-/g, ' ')).join('-');
      return m;
    }

    return null;
  });

  t.replaceFormatter((value) => {
    if(typeof value === 'string')
      return value.replace('-', '--').replace(/\s+/g, '-').toLowerCase()

    return null;
  });
}

module.exports = (SharedMethods) => createFluent(
  [keywordsType],
  SharedMethods
);
