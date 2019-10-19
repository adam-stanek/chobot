import { Route, Router, T } from 'chobot'

describe('Complex listing example', function() {
  const categorySlugDict = {
    green: 1,
    'green/little': 2,
    'green/big': 3,
    red: 4,
    'red/round': 5,
    'red/square': 6,
  }

  const ASC = 'asc'
  const DESC = 'desc'
  const sortSlugDictionary = {
    'by-name': { by: 'name', method: ASC },
    'by-name-desc': { by: 'name', method: DESC },
    'by-brand': { by: 'brand', method: ASC },
    'by-brand-desc': { by: 'brand', method: DESC },
  }

  const route = new Route({
    path: 'products',
    name: 'r1',
    children: [
      new Route({
        path: '[:categoryId]',
        params: { categoryId: T.dict(categorySlugDict).noEscape() },
        name: 'r2',
        children: [
          new Route({
            path: '[:brand]',
            params: { brand: T.keywords().excluding(Object.keys(categorySlugDict)) },
            name: 'r3',
            children: [
              new Route({
                path: '[:sorting]',
                params: {
                  sorting: T.dict(sortSlugDictionary).withDefault({ by: 'name', method: ASC }),
                },
                name: 'r4',
                children: [
                  new Route({
                    path: '[:pageNum]',
                    params: {
                      pageNum: T.int()
                        .gt(0)
                        .withDefault(1),
                    },
                    name: 'r5',
                    children: [new Route({ path: '.', name: 'r6' })],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })

  describe('URL matching', function() {
    function itMatches(url: string, params = {}) {
      it(
        'matches ' + url + (Object.keys(params).length ? ' with ' + JSON.stringify(params) : ''),
        function() {
          var m = route.match({ pathname: url })
          if (m) {
            expect(m.params).toEqual(
              Object.assign({ pageNum: 1, sorting: { by: 'name', method: ASC } }, params),
            )
            expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2', 'r3', 'r4', 'r5', 'r6'])
          } else {
            fail('expected match')
          }
        },
      )

      if (url[url.length - 1] != '/') itMatches(url + '/', params)
    }

    itMatches('products')

    var fragments = [
      ['green', { categoryId: 1 }],
      ['super-vendor', { brand: 'super vendor' }],
      ['by-brand', { sorting: { by: 'brand', method: ASC } }],
      ['2', { pageNum: 2 }],
    ]

    for (var i = 0; i < fragments.length; i++) {
      var url1 = 'products/' + fragments[i][0]
      for (var c = 1; c <= fragments.length - i; c++) {
        var slice = fragments.slice(i, i + c)
        var url = 'products/' + slice.map(p => p[0]).join('/')
        var params = slice.reduce((r, p) => Object.assign(r, p[1]), {})

        itMatches(url, params)

        for (var j = 2; j < slice.length; j++) {
          var slice2 = [slice[0]].concat(slice.slice(j))
          var url = 'products/' + slice2.map(p => p[0]).join('/')
          var params = slice2.reduce((r, p) => Object.assign(r, p[1]), {})

          itMatches(url, params)
        }
      }
    }
  })

  describe('URL construction', function() {
    var router = new Router(route)

    it('generates /products/green/super-vendor/by-brand/2/', function() {
      var url = router.createUrl('r6', {
        categoryId: 1,
        brand: 'super vendor',
        sorting: { by: 'brand', method: 'asc' },
        pageNum: 2,
      })
      expect(url).toBe('/products/green/super-vendor/by-brand/2/')
    })

    it('generates /products/green/super-vendor/2/', function() {
      var url = router.createUrl('r6', { categoryId: 1, brand: 'super vendor', pageNum: 2 })
      expect(url).toBe('/products/green/super-vendor/2/')
    })

    it('generates /products/green/2/', function() {
      var url = router.createUrl('r6', { categoryId: 1, pageNum: 2 })
      expect(url).toBe('/products/green/2/')
    })

    it('generates /products/2/', function() {
      var url = router.createUrl('r6', { pageNum: 2 })
      expect(url).toBe('/products/2/')
    })

    it('generates /products/', function() {
      var url = router.createUrl('r6', {})
      expect(url).toBe('/products/')
    })
  })
})
