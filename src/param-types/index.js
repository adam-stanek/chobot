'use strict';

const SharedMethods = {};
const ParamTypes = module.exports = {};

SharedMethods.withDefault = (t, defaultValue) =>
  t.setDefaultValue(defaultValue);

ParamTypes.string = require('./string.js')(SharedMethods);
ParamTypes.integer = require('./integer.js')(SharedMethods);
ParamTypes.dict = require('./dict.js')(SharedMethods);
ParamTypes.keywords = require('./keywords.js')(SharedMethods);
