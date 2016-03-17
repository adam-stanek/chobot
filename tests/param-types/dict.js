'use strict';
const expect = require('chai').expect;
const { composeChain } = require('@dobby/fluent');
const { ParamType } = require('../../src/ParamType.js');
const ParamTypes = require('../../src/param-types/index.js');

describe('ParamTypes.dict({ "a": 1, "a/b": 2 }).noEscape', function () {
  var t = composeChain(new ParamType, ParamTypes.dict({ "a": 1, "a/b": 2 }).noEscape.__chain);

  it('accepts "a/b"', function () {
    expect(
      t.filter("a/b")
    ).to.be.deep.equal({
      matchedString: 'a/b',
      value: 2
    });
  });
});
