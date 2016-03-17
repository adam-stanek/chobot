'use strict';
const { Route, ParamTypes } = require('../index.js');

describe('Users example', function () {
  var route = (
    <Route path="users" name="r1">
      {/* User listing */}
      <Route path="." name="r2" />

      {/* Form for creating new user.
        * Note: username param should be bound by som RegExp so that there
        * will be no conflicts. We don't do that to demonstrate priority
        * of route matching. */}
      <Route path="new-user" name="r3" />

      {/* Without username display global log of user logs
        * With username display filtered logs bound to that user. */}
      <Route path="[:username/]log" name="r4" />

      {/* Pages bound to concrete user */}
      <Route path=":username" name="r5">
        {/* User detail */}
        <Route path="." name="r6" />

        {/* User edit form */}
        <Route path="edit" name="r7" />
      </Route>
    </Route>
  );

  it('matches users/', function () {
    var m = route.match({ pathname: 'users/' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({});
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
  });

  it('matches users/new-user', function () {
    var m = route.match({ pathname: 'users/new-user' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({});
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r3']);
  });

  it('matches users/log', function () {
    var m = route.match({ pathname: 'users/log' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({});
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r4']);
  });

  it('matches users/jan.noha', function () {
    var m = route.match({ pathname: 'users/jan.noha' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({ username: 'jan.noha' });
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r5', 'r6']);
  });

  it('matches users/jan.noha/log', function () {
    var m = route.match({ pathname: 'users/jan.noha/log' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({ username: 'jan.noha' });
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r4']);
  });

  it('matches users/jan.noha/edit', function () {
    var m = route.match({ pathname: 'users/jan.noha/edit' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({ username: 'jan.noha' });
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r5', 'r7']);
  });
});
