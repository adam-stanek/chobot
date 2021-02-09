import { Route, Router, T } from 'chobot'

describe('Query parameters', function() {
  const route = new Route({ path: 'products', queryParams: { foo: T.int() }, name: 'r1' })

  describe('URL matching', function() {
    it('matches products?foo=55', function() {
      var m = route.match({ pathname: 'products', search: '?foo=55' })
      if (m) {
        expect(m.queryParams).toEqual({ foo: 55 })
      } else {
        fail('should match')
      }
    })

    it('rejects products?foo=bad', function() {
      var m = route.match({ pathname: 'products', search: '?foo=bad' })
      expect(m).toBe(false)
    })
  })

  describe('URL construction', function() {
    var router = new Router(route)

    it('generates URL without query parameter', function() {
      var url = router.createUrl('r1')
      expect(url).toBe('/products')
    })

    it('generates URL with foo = 55', function() {
      var url = router.createUrl('r1', { foo: 55 })
      expect(url).toBe('/products?foo=55')
    })
  })
})

describe('Query parameters with arrays', function() {
  const route = new Route({ path: 'products', name: 'r1' })

  describe('URL matching', function() {
    it('matches products?foo[]=a&foo[]=b', function() {
      var m = route.match({ pathname: 'products', search: '?foo%5B%5D=a&foo%5B%5D=b' })
      if (m) {
        expect(m.queryParams).toEqual({ foo: ['a', 'b'] })
      } else {
        fail('should match')
      }
    })
  })

  describe('URL construction', function() {
    var router = new Router(route)

    it('generates URL with foo = [a, b]', function() {
      var url = router.createUrl('r1', { foo: ['a', 'b'] })
      expect(url).toBe('/products?foo%5B%5D=a&foo%5B%5D=b')
    })
  })
})

describe('Query parameters with JSON', function () {
  const route = new Route({ path: 'products', name: 'r1', queryParams: { foo: T.obj() } })

  describe('URL matching', function () {
    it('matches /products?foo=eyJhIjoiQUFBxasiLCJiIjp0cnVlfQ', function () {
      const m = route.match({ pathname: 'products', search: '?foo=eyJhIjoiQUFBxasiLCJiIjp0cnVlfQ' })
      if (m) {
        expect(m.queryParams).toEqual({ foo: { a: 'AAA\u016B', b: true } })
      } else {
        fail('should match')
      }
    })
  })

  describe('URL construction', function () {
    const router = new Router(route)

    it('generates url with foo = { a: "AAA\\u016B", b: true }', function () {
      const url = router.createUrl('r1', { foo: { a: 'AAA\u016B', b: true } })
      expect(url).toBe('/products?foo=eyJhIjoiQUFBxasiLCJiIjp0cnVlfQ')
    })
  })
})
