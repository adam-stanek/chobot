import { Route } from 'chobot'

describe('Booking example', function() {
  // Imagine booking system and multi-page booking form.
  // At the initial booking there is no reservationId yet because
  // data are not saved on the server therefore they can't have a persistent id.
  //
  // This example shows how to make each page of booking form accessible for
  // times when it lives only in session and for when it is already saved.
  var route = new Route({ path: 'booking[/:reservationId]', name: 'r1' }, [
    // First page
    new Route({ path: '.', name: 'r2' }),
    // Customer form page
    new Route({ path: 'customer', name: 'r3' }),
  ])

  it('matches booking/', function() {
    var m = route.match({ pathname: 'booking/' })
    if (m) {
      expect(m.params).toEqual({})
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
    } else {
      fail('expected match')
    }
  })

  it('matches booking/customer', function() {
    var m = route.match({ pathname: 'booking/customer' })
    if (m) {
      expect(m.params).toEqual({})
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r3'])
    } else {
      fail('expected match')
    }
  })

  it('matches booking/4a5rrf1', function() {
    var m = route.match({ pathname: 'booking/4a5rrf1' })
    if (m) {
      expect(m.params).toEqual({ reservationId: '4a5rrf1' })
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
    } else {
      fail('expected match')
    }
  })

  it('matches booking/4a5rrf1/customer', function() {
    var m = route.match({ pathname: 'booking/4a5rrf1/customer' })
    if (m) {
      expect(m.params).toEqual({ reservationId: '4a5rrf1' })
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r3'])
    } else {
      fail('expected match')
    }
  })
})
