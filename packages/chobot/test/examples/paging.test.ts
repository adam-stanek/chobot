import { Route, Router, T } from 'chobot'

describe('Paging example', function() {
  const route = new Route(
    {
      path: 'items[/:pageNum]',
      params: {
        pageNum: T.int()
          .gt(0)
          .withDefault(1),
      },
      name: 'r1',
    },
    [new Route({ path: '.', name: 'r2' })],
  )

  describe('URL matching', function() {
    function itMatches(url: string, pageNum: number) {
      it('matches ' + url, function() {
        var m = route.match({ pathname: url })
        if (m) {
          expect(m.params).toEqual({ pageNum })
          expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
        } else {
          fail('should match')
        }
      })
    }

    itMatches('items', 1)
    itMatches('items/', 1)
    itMatches('items/1', 1)
    itMatches('items/1/', 1)
    itMatches('items/2', 2)
    itMatches('items/2/', 2)
  })

  describe('URL construction', function() {
    var router = new Router(route)

    it('generates URL without specified pageNum', function() {
      var url = router.createUrl('r2')
      expect(url).toBe('/items/')
    })

    it('generates URL with pageNum = 1', function() {
      var url = router.createUrl('r2', { pageNum: 1 })
      expect(url).toBe('/items/')
    })

    it('generates URL with pageNum = 2', function() {
      var url = router.createUrl('r2', { pageNum: 2 })
      expect(url).toBe('/items/2/')
    })
  })
})
