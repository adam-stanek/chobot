'use strict';
const { Router, Route, ParamTypes } = require('../index.js');

describe('Query parameters', function () {
  const route = (
    <Route path="products" name="r1" queryParams={{ foo: ParamTypes.integer }} />
  );

  describe('URL matching', function () {
    it('matches products?foo=55', function () {
      var m = route.match({ pathname: 'products', search: '?foo=55' });
      expect(m).to.be.an('object');
      expect(m.queryParams).to.be.deep.equal({ foo: 55 });
    });

    it('rejects products?foo=bad', function () {
      var m = route.match({ pathname: 'products', search: '?foo=bad' });
      expect(m).to.be.false;
    });
  });

  describe('URL construction', function () {
    var router = new Router(route);

    it('generates URL without query parameter', function () {
      var url = router.createUrl('r1');
      expect(url).to.be.equal('/products');
    });

    it('generates URL with foo = 55', function () {
      var url = router.createUrl('r1', { foo: 55 });
      expect(url).to.be.equal('/products?foo=55');
    });
  });
});

describe('Query parameters with arrays', function () {
  const route = (
    <Route path="products" name="r1" />
  );

  describe('URL matching', function () {
    it('matches products?foo[]=a&foo[]=b', function () {
      var m = route.match({ pathname: 'products', search: '?foo%5B%5D=a&foo%5B%5D=b' });
      expect(m).to.be.an('object');
      expect(m.queryParams).to.be.deep.equal({ foo: ['a', 'b'] });
    });
  });

  describe('URL construction', function () {
    var router = new Router(route);

    it('generates URL with foo = [a, b]', function () {
      var url = router.createUrl('r1', { foo: ['a', 'b'] });
      expect(url).to.be.equal('/products?foo%5B%5D=a&foo%5B%5D=b');
    });
  });
});

