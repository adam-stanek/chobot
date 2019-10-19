import { Route } from 'chobot/Route'
import { isRouteActive } from 'chobot/utils/isRouteActive'

describe('isRouteActive', () => {
  const index = new Route({ path: '.' })
  const leaf = new Route({ path: 'leaf' })
  const a = new Route({
    path: 'a',
    children: [index, leaf],
  })

  const b = new Route({
    path: 'b/:id',
    children: [index, leaf],
  })

  it('matches same routes', () => {
    const actual = {
      routes: [a, b],
    }

    const active = {
      routes: [a, b],
      params: {},
      queryParams: {},
    }

    expect(isRouteActive(actual, active)).toBe(true)
  })

  it('matches subset of routes', () => {
    const actual = {
      routes: [a],
    }

    const active = {
      routes: [a, b],
      params: {},
      queryParams: {},
    }

    expect(isRouteActive(actual, active)).toBe(true)
  })

  it('matches index route', () => {
    const actual = {
      routes: [a, index],
    }

    const active = {
      routes: [a, b],
      params: {},
      queryParams: {},
    }

    expect(isRouteActive(actual, active)).toBe(true)
  })

  it('matches route with the same params', () => {
    const actual = {
      routes: [b, index],
      params: {
        id: 'ID',
      },
    }

    const active = {
      routes: [b, index],
      params: { id: 'ID', someOtherParam: 'FOO' },
      queryParams: {},
    }

    expect(isRouteActive(actual, active)).toBe(true)
  })

  it("doesn't match route with param mismatch", () => {
    const actual = {
      routes: [b, index],
      params: {
        id: 'ID',
      },
    }

    const active = {
      routes: [b, index],
      params: { id: 'DIFFERENT_ID' },
      queryParams: {},
    }

    expect(isRouteActive(actual, active)).toBe(false)
  })
})
