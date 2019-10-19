import { Route } from 'chobot/Route'
import { Router } from 'chobot/Router'

describe('Simple example', function() {
  var router = new Router(
    new Route({
      name: 'r1',
      children: [new Route({ path: '.', name: 'r2' }), new Route({ path: 'about', name: 'r3' })],
    }),
  )

  describe('URL matching', function() {
    it('matches /', function() {
      var m = router.rootRoute.match({ pathname: '/' })
      if (m) {
        expect(m.params).toEqual({})
        expect(m!.routes.map(r => r.name)).toEqual(['r1', 'r2'])
      } else {
        fail('expected match')
      }
    })

    it('matches /about', function() {
      var m = router.rootRoute.match({ pathname: '/about' })
      if (m) {
        expect(m.params).toEqual({})
        expect(m!.routes.map(r => r.name)).toEqual(['r1', 'r3'])
      } else {
        fail('expected match')
      }
    })
  })

  describe('URL construction', function() {
    it('generates /', function() {
      var url = router.createUrl('r2')
      expect(url).toBe('/')
    })

    it('generates /about', function() {
      var url = router.createUrl('r3')
      expect(url).toBe('/about')
    })
  })
})
