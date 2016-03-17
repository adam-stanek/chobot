'use strict';
const { Router, Route, ParamTypes } = require('../index.js');

describe('Paging example', function () {
  var route = (
    <Route path="items[/:pageNum]" name="r1" params={{ pageNum: ParamTypes.integer.gt(0).withDefault(1) }}>
      <Route path="." name="r2" />
    </Route>
  );

  describe('URL matching', function () {
    function itMatches(url, pageNum ) {
      it('matches ' + url, function () {
        var m = route.match({ pathname: url });
        expect(m).to.be.an('object');
        expect(m.params).to.be.deep.equal({ pageNum });
        expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
      });
    }

    itMatches('items', 1);
    itMatches('items/', 1);
    itMatches('items/1', 1);
    itMatches('items/1/', 1);
    itMatches('items/2', 2);
    itMatches('items/2/', 2);
  });

  describe('URL construction', function () {
    var router = new Router([route]);

    it('generates URL without specified pageNum', function () {
      var url = router.createUrl('r2');
      expect(url).to.be.equal('/items/');
    });

    it('generates URL with pageNum = 1', function () {
      var url = router.createUrl('r2', { pageNum: 1 });
      expect(url).to.be.equal('/items/');
    });

    it('generates URL with pageNum = 2', function () {
      var url = router.createUrl('r2', { pageNum: 2 });
      expect(url).to.be.equal('/items/2/');
    });
  });
});
