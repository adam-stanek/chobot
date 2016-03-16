'use strict';
const { Route, ParamTypes } = require('../index.js');

describe('User route example', function () {
  var route = (
    <Route path="users[/:username]" params={{ username: ParamTypes.string.rx(/[a-z0-9\.]+/) }} name="r1">
      <Route path="." name="r2" />
      <Route path="new-user" name="r3" />
    </Route>
  );

  it('matches users/', function () {
    var m = route.match({ pathname: 'users/' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({});
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
  });

  it('matches users/jan.noha', function () {
    var m = route.match({ pathname: 'users/jan.noha' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({ username: 'jan.noha' });
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
  });

  it('matches users/new-user', function () {
    var m = route.match({ pathname: 'users/new-user' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({});
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r3']);
  });
});
