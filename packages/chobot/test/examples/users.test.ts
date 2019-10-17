import { Route } from 'chobot'

describe('Users example', function() {
  var route = new Route({ path: 'users', name: 'r1' }, [
    // User listing
    new Route({ path: '.', name: 'r2' }),

    // Form for creating new user.
    // Note: username param should be bound by some RegExp so that there
    // will be no conflicts. We don't do that to demonstrate priority
    // of route matching.
    new Route({ path: 'new-user', name: 'r3' }),

    // Without username display global log of user logs
    // With username display filtered logs bound to that user.
    new Route({ path: '[:username/]log', name: 'r4' }),

    // Pages bound to concrete user
    new Route({ path: ':username', name: 'r5' }, [
      // User detail
      new Route({ path: '.', name: 'r6' }),

      // User edit form
      new Route({ path: 'edit', name: 'r7' }),
    ]),
  ])

  it('matches users/', function() {
    var m = route.match({ pathname: 'users/' })
    if (m) {
      expect(m.params).toEqual({})
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r2'])
    } else {
      fail('should match')
    }
  })

  it('matches users/new-user', function() {
    var m = route.match({ pathname: 'users/new-user' })
    if (m) {
      expect(m.params).toEqual({})
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r3'])
    } else {
      fail('should match')
    }
  })

  it('matches users/log', function() {
    var m = route.match({ pathname: 'users/log' })
    if (m) {
      expect(m.params).toEqual({})
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r4'])
    } else {
      fail('should match')
    }
  })

  it('matches users/jan.noha', function() {
    var m = route.match({ pathname: 'users/jan.noha' })
    if (m) {
      expect(m.params).toEqual({ username: 'jan.noha' })
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r5', 'r6'])
    } else {
      fail('should match')
    }
  })

  it('matches users/jan.noha/log', function() {
    var m = route.match({ pathname: 'users/jan.noha/log' })
    if (m) {
      expect(m.params).toEqual({ username: 'jan.noha' })
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r4'])
    } else {
      fail('should match')
    }
  })

  it('matches users/jan.noha/edit', function() {
    var m = route.match({ pathname: 'users/jan.noha/edit' })
    if (m) {
      expect(m.params).toEqual({ username: 'jan.noha' })
      expect(m.routes.map(r => r.name)).toEqual(['r1', 'r5', 'r7'])
    } else {
      fail('should match')
    }
  })
})
