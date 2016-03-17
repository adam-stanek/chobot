'use strict';
const { Router, Route, ParamTypes } = require('../index.js');

describe('Category example', function () {
  var categorySlugDict = {
    'green': 1,
    'green/little': 2,
    'green/big': 3,
    'red': 4,
    'red/round': 5,
    'red/square': 6
  };

  var route = (
    <Route path="products[/:categoryId]" name="r1" params={{ categoryId: ParamTypes.dict(categorySlugDict).noEscape }}>
      {/* Display all the products */}
      <Route path="." name="r2" />
    </Route>
  );

  describe('URL matching', function () {
    it('matches products', function () {
      var m = route.match({ pathname: 'products' });
      expect(m).to.be.an('object');
      expect(m.params).to.be.deep.equal({});
      expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
    });

    it('matches products/', function () {
      var m = route.match({ pathname: 'products/' });
      expect(m).to.be.an('object');
      expect(m.params).to.be.deep.equal({});
      expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
    });

    for(var categorySlug in categorySlugDict) {
      var url = 'products/' + categorySlug;
      it('matches ' + url, function () {
        var m = route.match({ pathname: url });
        expect(m).to.be.an('object');
        expect(m.params).to.be.deep.equal({ categoryId: categorySlugDict[categorySlug] });
        expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
      });

      url += '/';
      it('matches ' + url, function () {
        var m = route.match({ pathname: url });
        expect(m).to.be.an('object');
        expect(m.params).to.be.deep.equal({ categoryId: categorySlugDict[categorySlug] });
        expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
      });
    }
  });

  describe('URL construction', function () {
    var router = new Router(route);

    it('generates URL for category #2', function () {
      var url = router.createUrl('r2', { categoryId: 2 });
      expect(url).to.be.equal('/products/green/little/');
    });
  });
});
