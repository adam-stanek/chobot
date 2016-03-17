'use strict';
const { Router, Route, ParamTypes } = require('../index.js');

describe('Sorting example', function () {
  const ASC = 'asc'
  const DESC = 'desc';
  const sortSlugDictionary = {
    'by-name': { by: 'name', method: ASC },
    'by-name-desc': { by: 'name', method: DESC },
    'by-brand': { by: 'brand', method: ASC },
    'by-brand-desc': { by: 'brand', method: DESC }
  };

  var route = (
    <Route path="products[/:sorting]" name="r1" params={{ sorting: ParamTypes.dict(sortSlugDictionary).withDefault({ by: 'name', method: ASC }) }}>
      <Route path="." name="r2" />
    </Route>
  );

  describe('URL matching', function () {
    function itMatches(url, sorting) {
      it('matches ' + url, function () {
        var m = route.match({ pathname: url });
        expect(m).to.be.an('object');
        expect(m.params).to.be.deep.equal({ sorting });
        expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
      });
    }

    itMatches('products', { by: 'name', method: ASC });
    itMatches('products/', { by: 'name', method: ASC });
    itMatches('products/by-name', { by: 'name', method: ASC });
    itMatches('products/by-name/', { by: 'name', method: ASC });
    itMatches('products/by-name-desc', { by: 'name', method: DESC });
    itMatches('products/by-name-desc/', { by: 'name', method: DESC });
    itMatches('products/by-brand', { by: 'brand', method: ASC });
    itMatches('products/by-brand/', { by: 'brand', method: ASC });
    itMatches('products/by-brand-desc', { by: 'brand', method: DESC });
    itMatches('products/by-brand-desc/', { by: 'brand', method: DESC });
  });

  describe('URL construction', function () {
    var router = new Router([route]);

    it('generates URL without specified sorting', function () {
      var url = router.createUrl('r2');
      expect(url).to.be.equal('/products/');
    });

    it('generates URL for products sorted by name', function () {
      var url = router.createUrl('r2', { sorting: { by: 'name', method: ASC }});
      expect(url).to.be.equal('/products/');
    });

    it('generates URL for products sorted by name in descending order', function () {
      var url = router.createUrl('r2', { sorting: { by: 'name', method: DESC }});
      expect(url).to.be.equal('/products/by-name-desc/');
    });

    it('generates URL for products sorted by brand', function () {
      var url = router.createUrl('r2', { sorting: { by: 'brand', method: ASC }});
      expect(url).to.be.equal('/products/by-brand/');
    });

    it('generates URL for products sorted by brand in descending order', function () {
      var url = router.createUrl('r2', { sorting: { by: 'brand', method: DESC }});
      expect(url).to.be.equal('/products/by-brand-desc/');
    });
  });
});
