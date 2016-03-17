'use strict';
const { Router, Route, ParamTypes } = require('../index.js');

describe('Search keywords example', function () {
  var route = (
    <Route path="search[/:keywords]" name="r1" params={{ keywords: ParamTypes.keywords }} />
  );

  describe('URL matching', function () {
    function itMatches(url, params = {}) {
      it('matches ' + url, function () {
        var m = route.match({ pathname: url });
        expect(m).to.be.an('object');
        expect(m.params).to.be.deep.equal(params);
        expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1']);
      });
    }

    itMatches('search');
    itMatches('search/');
    itMatches('search/foo-bar', { keywords: 'foo bar' });
    itMatches('search/foo-bar/', { keywords: 'foo bar' });
  });

  describe('URL construction', function () {
    var router = new Router([route]);

    it('generates URL without specified keywords', function () {
      var url = router.createUrl('r1');
      expect(url).to.be.equal('/search');
    });

    it('generates URL for search keywords "foo bar"', function () {
      var url = router.createUrl('r1', { keywords: "foo bar" });
      expect(url).to.be.equal('/search/foo-bar');
    });
  });
});
