import { Route, Router, T } from 'chobot'

describe('Category example', function() {
  var categorySlugDict: { [k: string]: number } = {
    green: 1,
    'green/little': 2,
    'green/big': 3,
    red: 4,
    'red/round': 5,
    'red/square': 6,
  }

  var route = new Route(
    {
      path: 'products[/:categoryId]',
      name: 'r1',
      params: { categoryId: T.dict(categorySlugDict).noEscape() },
    },
    [new Route({ path: '.', name: 'r2' })],
  )

  describe('URL matching', function() {
    it('matches products', function() {
      var m = route.match({ pathname: 'products' })
      if (m) {
        expect(m.params).toEqual({})
        expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
      } else {
        fail('expected match')
      }
    })

    it('matches products/', function() {
      var m = route.match({ pathname: 'products/' })
      if (m) {
        expect(m.params).toEqual({})
        expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
      } else {
        fail('expected match')
      }
    })

    for (var categorySlug in categorySlugDict) {
      var url = 'products/' + categorySlug
      it('matches ' + url, function() {
        var m = route.match({ pathname: url })
        if (m) {
          expect(m.params).toEqual({ categoryId: categorySlugDict[categorySlug] })
          expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
        } else {
          fail('expected match')
        }
      })

      url += '/'
      it('matches ' + url, function() {
        var m = route.match({ pathname: url })
        if (m) {
          expect(m.params).toEqual({ categoryId: categorySlugDict[categorySlug] })
          expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
        } else {
          fail('expected match')
        }
      })
    }
  })

  describe('URL construction', function() {
    var router = new Router(route)

    it('generates URL for category #2', function() {
      var url = router.createUrl('r2', { categoryId: 2 })
      expect(url).toBe('/products/green/little/')
    })
  })
})
