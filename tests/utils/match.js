'use strict';
const expect = require('chai').expect;
const match = require('../../src/utils/match.js');

describe('utils/match()', function () {
  it('accepts exact match', function () {
    var matchingTree = [
      { s: 'foo' }
    ];

    var m = match('foo', matchingTree);
    expect(m).to.be.deep.equal({ index: 3, params: {} });
  });

  it('rejects partial match', function () {
    var matchingTree = [
      { s: 'foobar' }
    ];

    var m = match('foo', matchingTree);
    expect(m).to.be.false;
  });
});
