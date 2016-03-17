'use strict';
const expect = require('chai').expect;
const { composeChain } = require('@dobby/fluent');
const { ParamType } = require('../../src/ParamType.js');
const ParamTypes = require('../../src/param-types/index.js');

describe('ParamTypes.string', function () {
  var t = composeChain(new ParamType, ParamTypes.string.__chain);

  it('accepts "foobar"', function () {
    expect(
      t.filter("foobar")
    ).to.be.deep.equal({
      matchedString: 'foobar',
      value: 'foobar'
    });
  });
});

describe('ParamTypes.string.rx(/[abcd]+/)', function () {
  var t = composeChain(new ParamType, ParamTypes.string.rx(/[abcd]+/).__chain);

  it('accepts "abcd"', function () {
    expect(
      t.filter("abcd")
    ).to.be.deep.equal({
      matchedString: 'abcd',
      value: 'abcd'
    });
  });

  it('rejects "_abcd"', function () {
    expect(
      t.filter("_abcd")
    ).to.be.null;
  });
});

describe('ParamTypes.string.excluding("foo")', function () {
  var t = composeChain(new ParamType, ParamTypes.string.excluding("foo").__chain);

  it('accepts "foobar"', function () {
    expect(
      t.filter("foobar")
    ).to.be.deep.equal({
      matchedString: 'foobar',
      value: 'foobar'
    });
  });

  it('rejects "foo"', function () {
    expect(
      t.filter("foo")
    ).to.be.null;
  });
});

describe('ParamTypes.string.excluding(/[abcd]+/)', function () {
  var t = composeChain(new ParamType, ParamTypes.string.excluding(/[abcd]+/).__chain);

  it('accepts "efgh"', function () {
    expect(
      t.filter("efgh")
    ).to.be.deep.equal({
      matchedString: 'efgh',
      value: 'efgh'
    });
  });

  it('rejects "abcd"', function () {
    expect(
      t.filter("abcd")
    ).to.be.null;
  });
});

describe('ParamTypes.string.excluding(["alice", "bob"])', function () {
  var t = composeChain(new ParamType, ParamTypes.string.excluding(["alice", "bob"]).__chain);

  it('accepts "charlie"', function () {
    expect(
      t.filter("charlie")
    ).to.be.deep.equal({
      matchedString: 'charlie',
      value: 'charlie'
    });
  });

  it('rejects "alice"', function () {
    expect(
      t.filter("alice")
    ).to.be.null;
  });

  it('rejects "bob"', function () {
    expect(
      t.filter("bob")
    ).to.be.null;
  });
});

describe('ParamTypes.string.excluding((v) => v.length % 2)', function () {
  var t = composeChain(new ParamType, ParamTypes.string.excluding((v) => v.length % 2).__chain);

  it('accepts "adam"', function () {
    expect(
      t.filter("adam")
    ).to.be.deep.equal({
      matchedString: 'adam',
      value: 'adam'
    });
  });

  it('rejects "bob"', function () {
    expect(
      t.filter("bob")
    ).to.be.null;
  });
});
