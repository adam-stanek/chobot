'use strict';
const expect = require('chai').expect;
const isOptionalForParams = require('../../src/utils/isOptionalForParams.js');

describe('utils/isOptionalForParams()', function () {
  describe('[/:param1[/:param2]]', function () {
    var matchingTree = {
      o: [
        { s: '/' },
        { p: 'param1' },
        { o: [
          { s: '/' },
          { p: 'param2' }
        ]}
      ]
    };

    it('is not optional when both parameters are provided and no default is set', function () {
      expect(
        isOptionalForParams(matchingTree, { param1: 'foo', param2: 'bar' }, {})
      ).to.be.false;
    });

    it('is optional when param1 is not provided and param2 is equal default value', function () {
      expect(
        isOptionalForParams(matchingTree, { param2: 'bar' }, { param2: { defaultValue: 'bar' }})
      ).to.be.true;
    });

    it('is optional if none of the parameters is provided', function () {
      expect(
        isOptionalForParams(matchingTree, {}, {})
      ).to.be.true;
    });

    it('is optional if none of the parameters is provided but there is default value', function () {
      expect(
        isOptionalForParams(matchingTree, {}, { param2: { defaultValue: 'bar' }})
      ).to.be.true;
    })
  });
});
