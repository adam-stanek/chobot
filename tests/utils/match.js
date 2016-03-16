'use strict';
const expect = require('chai').expect;
const match = require('../../src/utils/match.js');

describe('utils/match()', function () {
  describe('foo', function () {
    var matchingTree = [
      { s: 'foo' }
    ];

    it('accepts "foo"', function () {
      var m = match('foo', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 3, rank: 1, params: {} }
      ]);
    });

    it('rejects "f"', function () {
      var m = match('f', matchingTree);
      expect(m).to.be.deep.equal([]);
    });
  });

  describe('foo[bar]', function () {
    var matchingTree = [
      { s: 'foo' },
      { o: [
        { s: 'bar' }
      ]}
    ];

    it('accepts "foobar"', function () {
      var m = match('foobar', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 6, rank: 2, params: {} },
        { matchedLength: 3, rank: 1, params: {} }
      ]);
    });

    it('accepts "foo"', function () {
      var m = match('foo', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 3, rank: 1, params: {} }
      ]);
    });
  });

  describe('a[b[c]]', function () {
    var matchingTree = [
      { s: 'a' },
      { o: [
        { s: 'b' },
        { o: [
          { s: 'c' }
        ]}
      ]}
    ];

    it('accepts "abc"', function () {
      var m = match('abc', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 3, rank: 3, params: {} },
        { matchedLength: 2, rank: 2, params: {} },
        { matchedLength: 1, rank: 1, params: {} }
      ]);
    });

    it('accepts "ab"', function () {
      var m = match('ab', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 2, rank: 2, params: {} },
        { matchedLength: 1, rank: 1, params: {} }
      ]);
    });

    it('accepts "a"', function () {
      var m = match('a', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 1, rank: 1, params: {} }
      ]);
    });
  });
});
