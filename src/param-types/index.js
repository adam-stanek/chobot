'use strict';

const SharedMethods = {};
const ParamTypes = module.exports = {};

SharedMethods.withDefault = (t, defaultValue) =>
  t.setDefaultValue(defaultValue);

SharedMethods.noEscape = (t) =>
  t.setEscapeEnabled(false);

SharedMethods.excluding = (t, filter) => {
  if(typeof filter === 'function') {
    t.chainFilter((m) =>
      m && !filter(m.value) ? m : null
    );
  } else if(Array.isArray(filter)) {
    t.chainFilter((m) =>
      m && filter.indexOf(m.value) === -1 ? m : null
    );
  } else if(filter instanceof RegExp) {
    t.chainFilter((m) =>
      m && !filter.test(m.value) ? m : null
    );
  } else {
    t.chainFilter((m) =>
      m && m.value === filter ? null : m
    );
  }
};

ParamTypes.string = require('./string.js')(SharedMethods);
ParamTypes.integer = require('./integer.js')(SharedMethods);
ParamTypes.dict = require('./dict.js')(SharedMethods);
ParamTypes.keywords = require('./keywords.js')(SharedMethods);
