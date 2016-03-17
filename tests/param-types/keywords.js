'use strict';
const expect = require('chai').expect;
const { composeChain } = require('@dobby/fluent');
const { ParamType } = require('../../src/ParamType.js');
const ParamTypes = require('../../src/param-types/index.js');

describe('ParamTypes.keywords', function () {
  var t = composeChain(new ParamType, ParamTypes.keywords.__chain);

  it('accepts "foo-bar/test"', function () {
    expect(
      t.filter("foo-bar/test")
    ).to.be.deep.equal({
      matchedString: 'foo-bar',
      value: 'foo bar'
    });
  });
});
