'use strict';
const regExpFilter = require('./utils/regExpFilter.js');

// Default RX filter (allow everything except for [/?#])
const DEFAULT_FILTER = regExpFilter(/[^\/\#\?]+/);

// Default formatter (encode for use in URL but pass null/undefined values)
const DEFAULT_FORMATTER = (value) => {
  switch(value) {
    case null:
    case undefined:
      return value;
    default:
      return encodeURIComponent(value);
  }
};

class ParamType {
  constructor() {
    this.filter = this.filter.bind(this);
  }

  filter(value) {
    return (this._filter || DEFAULT_FILTER)({ matchedString: value, value });
  }

  get format() {
    if(this._escape === false)
      return this._formatter ? this._formatter : (value) => value;
    else
      return this._formatter ? (value) => DEFAULT_FORMATTER(this._formatter(value)) : DEFAULT_FORMATTER;
  }

  setEscapeEnabled(val) {
    this._escape = !!val;
  }

  setDefaultValue(val) {
    this.defaultValue = val;
  }

  replaceFormatter(fn) {
    this._formatter = fn;
  }

  chainFormatter(fn) {
    var prevFn = this._formatter;
    this._formatter = prevFn ? (value) => fn(prevFn(value)) : fn;
  }

  replaceFilter(fn) {
    this._filter = fn;
  }

  chainFilter(fn) {
    var prevFn = this._filter;
    this._filter = prevFn ? (value) => fn(prevFn(value)) : fn;
  }
}

module.exports = {
  DEFAULT_FILTER,
  DEFAULT_FORMATTER,
  ParamType
};
