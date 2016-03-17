'use strict';
const { Route, ParamTypes } = require('../index.js');

describe('Booking example', function () {
  // Imagine booking system and multi-page booking form.
  // At the initial booking there is no reservationId yet because
  // data are not saved on the server therefore they can't have a persistent id.
  //
  // This example shows how to make each page of booking form accessible for
  // times when it lives only in session and for when it is already saved.
  var route = (
    <Route path="booking[/:reservationId]" name="r1">
      {/* First page */}
      <Route path="." name="r2" />
      {/* Customer form page */}
      <Route path="customer" name="r3" />
    </Route>
  );

  it('matches booking/', function () {
    var m = route.match({ pathname: 'booking/' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({});
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
  });

  it('matches booking/customer', function () {
    var m = route.match({ pathname: 'booking/customer' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({});
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r3']);
  });

  it('matches booking/4a5rrf1', function () {
    var m = route.match({ pathname: 'booking/4a5rrf1' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({ reservationId: '4a5rrf1' });
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r2']);
  });

  it('matches booking/4a5rrf1/customer', function () {
    var m = route.match({ pathname: 'booking/4a5rrf1/customer' });
    expect(m).to.be.an('object');
    expect(m.params).to.be.deep.equal({ reservationId: '4a5rrf1' });
    expect(m.routes.map((r) => r.name)).to.be.deep.equal(['r1', 'r3']);
  });
});
