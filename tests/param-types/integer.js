'use strict';
const expect = require('chai').expect;
const { composeChain } = require('@dobby/fluent');
const { ParamType } = require('../../src/ParamType.js');
const ParamTypes = require('../../src/param-types/index.js');

describe('ParamTypes.integer', function () {
  var t = composeChain(new ParamType, ParamTypes.integer.__chain);

  it('accepts "foobar"', function () {
    expect(
      t.filter("18foobar")
    ).to.be.deep.equal({
      matchedString: '18',
      value: 18
    });
  });
});
