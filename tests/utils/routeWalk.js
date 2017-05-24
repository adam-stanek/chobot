'use strict';
const expect = require('chai').expect;
const { Route, routeWalk } = require('../../index.js');

describe('routeWalk()', function () {
  var r121 = new Route({ name: 'r121' }, []);
  var r12 = new Route({ name: 'r12' }, [ r121 ]);
  var r11 = new Route({ name: 'r11' }, []);
  var r1 = new Route({ name: 'r1' }, [ r11, r12 ]);

  it('walks the routes', function () {
    var g = routeWalk([r1]);
    expect(g.next()).to.deep.equal({ done: false, value: [ r1 ] });
    expect(g.next()).to.deep.equal({ done: false, value: [ r1, r11 ] });
    expect(g.next()).to.deep.equal({ done: false, value: [ r1, r12 ] });
    expect(g.next()).to.deep.equal({ done: false, value: [ r1, r12, r121 ] });
    expect(g.next()).to.deep.equal({ done: true, value: undefined });
  });

  it('walks the routes with initial stack', function () {
    var g = routeWalk([r1, r12]);
    expect(g.next()).to.deep.equal({ done: false, value: [ r1, r12 ] });
    expect(g.next()).to.deep.equal({ done: false, value: [ r1, r12, r121 ] });
    expect(g.next()).to.deep.equal({ done: true, value: undefined });
  });
});
