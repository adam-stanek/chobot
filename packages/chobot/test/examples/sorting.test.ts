import { Route, T, Router } from '~'

const enum SortingMethod {
  ASC = 'asc',
  DESC = 'desc',
}

interface Sorting {
  by: string
  method: SortingMethod
}

describe('Sorting example', function() {
  const sortSlugDictionary: { [k: string]: Sorting } = {
    'by-name': { by: 'name', method: SortingMethod.ASC },
    'by-name-desc': { by: 'name', method: SortingMethod.DESC },
    'by-brand': { by: 'brand', method: SortingMethod.ASC },
    'by-brand-desc': { by: 'brand', method: SortingMethod.DESC },
  }

  var route = new Route(
    {
      path: 'products[/:sorting]',
      params: {
        sorting: T.dict(sortSlugDictionary).withDefault({ by: 'name', method: SortingMethod.ASC }),
      },
      name: 'r1',
    },
    [new Route({ path: '.', name: 'r2' })],
  )

  describe('URL matching', function() {
    function itMatches(url: string, sorting: Sorting) {
      it('matches ' + url, function() {
        var m = route.match({ pathname: url })
        if (m) {
          expect(m.params).toEqual({ sorting })
          expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
        } else {
          fail('should match')
        }
      })
    }

    itMatches('products', { by: 'name', method: SortingMethod.ASC })
    itMatches('products/', { by: 'name', method: SortingMethod.ASC })
    itMatches('products/by-name', { by: 'name', method: SortingMethod.ASC })
    itMatches('products/by-name/', { by: 'name', method: SortingMethod.ASC })
    itMatches('products/by-name-desc', { by: 'name', method: SortingMethod.DESC })
    itMatches('products/by-name-desc/', { by: 'name', method: SortingMethod.DESC })
    itMatches('products/by-brand', { by: 'brand', method: SortingMethod.ASC })
    itMatches('products/by-brand/', { by: 'brand', method: SortingMethod.ASC })
    itMatches('products/by-brand-desc', { by: 'brand', method: SortingMethod.DESC })
    itMatches('products/by-brand-desc/', { by: 'brand', method: SortingMethod.DESC })
  })

  describe('URL construction', function() {
    var router = new Router(route)

    it('generates URL without specified sorting', function() {
      var url = router.createUrl('r2')
      expect(url).toBe('/products/')
    })

    it('generates URL for products sorted by name', function() {
      var url = router.createUrl('r2', { sorting: { by: 'name', method: SortingMethod.ASC } })
      expect(url).toBe('/products/')
    })

    it('generates URL for products sorted by name in descending order', function() {
      var url = router.createUrl('r2', { sorting: { by: 'name', method: SortingMethod.DESC } })
      expect(url).toBe('/products/by-name-desc/')
    })

    it('generates URL for products sorted by brand', function() {
      var url = router.createUrl('r2', { sorting: { by: 'brand', method: SortingMethod.ASC } })
      expect(url).toBe('/products/by-brand/')
    })

    it('generates URL for products sorted by brand in descending order', function() {
      var url = router.createUrl('r2', { sorting: { by: 'brand', method: SortingMethod.DESC } })
      expect(url).toBe('/products/by-brand-desc/')
    })
  })
})
