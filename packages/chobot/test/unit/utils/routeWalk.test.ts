import { Route } from 'chobot/Route'
import { routeWalk } from 'chobot/utils/routeWalk'

describe('routeWalk()', function() {
  var r121 = new Route({ name: 'r121', children: [] })
  var r12 = new Route({ name: 'r12', children: [r121] })
  var r11 = new Route({ name: 'r11', children: [] })
  var r1 = new Route({ name: 'r1', children: [r11, r12] })

  it('walks the routes', function() {
    var g = routeWalk([r1])
    expect(g.next()).toEqual({ done: false, value: [r1] })
    expect(g.next()).toEqual({ done: false, value: [r1, r11] })
    expect(g.next()).toEqual({ done: false, value: [r1, r12] })
    expect(g.next()).toEqual({ done: false, value: [r1, r12, r121] })
    expect(g.next()).toEqual({ done: true, value: undefined })
  })

  it('walks the routes with initial stack', function() {
    var g = routeWalk([r1, r12])
    expect(g.next()).toEqual({ done: false, value: [r1, r12] })
    expect(g.next()).toEqual({ done: false, value: [r1, r12, r121] })
    expect(g.next()).toEqual({ done: true, value: undefined })
  })
})
