'use strict';
const { Router, Route } = require('../index.js');

describe('Simple example', function () {
  var router = new Router((
    <Route name="r1">
      <Route path="." name="r2" />
      <Route path="about" name="r3" />
    </Route>
  ));

  describe('URL matching', function () {
    it('matches /', function () {
      var m = router.rootRoute.match({ pathname: '/' });
      expect(m).to.be.an('object');
      expect(m.params).to.be.deep.equal({});
      expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
    });

    it('matches /about', function () {
      var m = router.rootRoute.match({ pathname: '/about' });
      expect(m).to.be.an('object');
      expect(m.params).to.be.deep.equal({});
      expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r3']);
    });
  });

  describe('URL construction', function () {
    it('generates /', function () {
      var url = router.createUrl('r2');
      expect(url).to.be.equal('/');
    });

    it('generates /about', function () {
      var url = router.createUrl('r3');
      expect(url).to.be.equal('/about');
    });
  });
});
