import { Route, Router, T } from 'chobot'

describe('Search keywords example', function() {
  var route = new Route({
    path: 'search[/:keywords[/:pageNum]]',
    params: {
      keywords: T.keywords(),
      pageNum: T.int()
        .gt(0)
        .withDefault(1),
    },
    name: 'r1',
  })

  describe('URL matching', function() {
    function itMatches(url: string, params = {}) {
      it('matches ' + url, function() {
        var m = route.match({ pathname: url })
        if (m) {
          expect(m.params).toEqual(params)
          expect(m.routes.map(r => r.name)).toEqual(['r1'])
        } else {
          fail('should match')
        }
      })
    }

    itMatches('search', { pageNum: 1 })
    itMatches('search/', { pageNum: 1 })
    itMatches('search/foo-bar', { keywords: 'foo bar', pageNum: 1 })
    itMatches('search/foo-bar/', { keywords: 'foo bar', pageNum: 1 })
    itMatches('search/foo-bar/2', { keywords: 'foo bar', pageNum: 2 })
    itMatches('search/foo-bar/2/', { keywords: 'foo bar', pageNum: 2 })
  })

  describe('URL construction', function() {
    var router = new Router(route)

    it('generates URL without specified keywords', function() {
      var url = router.createUrl('r1')
      expect(url).toEqual('/search')
    })

    it('generates URL for search keywords "foo bar"', function() {
      var url = router.createUrl('r1', { keywords: 'foo bar' })
      expect(url).toEqual('/search/foo-bar')
    })

    it('generates URL for search keywords "foo bar", 2nd page', function() {
      var url = router.createUrl('r1', { keywords: 'foo bar', pageNum: 2 })
      expect(url).toEqual('/search/foo-bar/2')
    })
  })
})
