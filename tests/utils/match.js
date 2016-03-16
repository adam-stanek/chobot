'use strict';
const expect = require('chai').expect;
const match = require('../../src/utils/match.js');

describe('utils/match()', function () {
  describe('empty pattern', function () {
    it('matches everything with 0 length', function () {
      var m = match('foo', []);
      expect(m).to.be.deep.equal([
        { matchedLength: 0, rank: 0, params: {} }
      ]);
    });
  });

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

    it('rejects "foobar"', function () {
      var m = match('foobar', matchingTree);
      expect(m).to.be.deep.equal([]);
    });

    it('accepts "foo/bar"', function () {
      var m = match('foo/bar', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 3, rank: 1, params: {} }
      ]);
    });
  });

  describe('foo[/bar]', function () {
    var matchingTree = [
      { s: 'foo' },
      { o: [
        { s: '/bar' }
      ]}
    ];

    it('accepts "foo/bar"', function () {
      var m = match('foo/bar', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 7, rank: 2, params: {} },
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

  describe('a[/b[/c]]', function () {
    var matchingTree = [
      { s: 'a' },
      { o: [
        { s: '/b' },
        { o: [
          { s: '/c' }
        ]}
      ]}
    ];

    it('accepts "a/b/c"', function () {
      var m = match('a/b/c', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 5, rank: 3, params: {} },
        { matchedLength: 3, rank: 2, params: {} },
        { matchedLength: 1, rank: 1, params: {} }
      ]);
    });

    it('accepts "a/b"', function () {
      var m = match('a/b', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 3, rank: 2, params: {} },
        { matchedLength: 1, rank: 1, params: {} }
      ]);
    });

    it('accepts "a"', function () {
      var m = match('a', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 1, rank: 1, params: {} }
      ]);
    });

    it('partialy accepts "a/c"', function () {
      var m = match('a/c', matchingTree);
      expect(m).to.be.deep.equal([
        { matchedLength: 1, rank: 1, params: {} }
      ]);
    });

    it('rejects "c"', function () {
      var m = match('c', matchingTree);
      expect(m).to.be.deep.equal([]);
    });
  });
});
