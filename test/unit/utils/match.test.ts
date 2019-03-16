import { match } from '~/utils/match'

describe('utils/match()', function() {
  describe('empty pattern', function() {
    it('matches "foo" with 0 length', function() {
      var m = match('foo', [])
      expect(m).toEqual([{ matchedLength: 0, rank: 0, params: {} }])
    })

    it('matches "foo/bar" starting from index 4', function() {
      var m = match('foo/bar', [], {}, 4)
      expect(m).toEqual([{ matchedLength: 0, rank: 0, params: {} }])
    })
  })

  describe('foo', function() {
    var matchingTree = [{ s: 'foo' }]

    it('accepts "foo"', function() {
      var m = match('foo', matchingTree)
      expect(m).toEqual([{ matchedLength: 3, rank: 1, params: {} }])
    })

    it('rejects "f"', function() {
      var m = match('f', matchingTree)
      expect(m).toEqual([])
    })

    it('rejects "foobar"', function() {
      var m = match('foobar', matchingTree)
      expect(m).toEqual([])
    })

    it('accepts "foo/bar"', function() {
      var m = match('foo/bar', matchingTree)
      expect(m).toEqual([{ matchedLength: 3, rank: 1, params: {} }])
    })

    it('accepts "test/foo" starting from index 5', function() {
      var m = match('test/foo', matchingTree, {}, 5)
      expect(m).toEqual([{ matchedLength: 3, rank: 1, params: {} }])
    })

    it('rejects "test/foobar" starting from index 5', function() {
      var m = match('test/foobar', matchingTree, {}, 5)
      expect(m).toEqual([])
    })
  })

  describe('foo[/bar]', function() {
    var matchingTree = [
      { s: 'foo' },
      {
        o: [{ s: '/bar' }],
      },
    ]

    it('accepts "foo/bar"', function() {
      var m = match('foo/bar', matchingTree)
      expect(m).toEqual([
        { matchedLength: 7, rank: 2, params: {} },
        { matchedLength: 3, rank: 1, params: {} },
      ])
    })

    it('accepts "foo"', function() {
      var m = match('foo', matchingTree)
      expect(m).toEqual([{ matchedLength: 3, rank: 1, params: {} }])
    })
  })

  describe('a[/b[/c]]', function() {
    var matchingTree = [
      { s: 'a' },
      {
        o: [
          { s: '/b' },
          {
            o: [{ s: '/c' }],
          },
        ],
      },
    ]

    it('accepts "a/b/c"', function() {
      var m = match('a/b/c', matchingTree)
      expect(m).toEqual([
        { matchedLength: 5, rank: 3, params: {} },
        { matchedLength: 3, rank: 2, params: {} },
        { matchedLength: 1, rank: 1, params: {} },
      ])
    })

    it('accepts "a/b"', function() {
      var m = match('a/b', matchingTree)
      expect(m).toEqual([
        { matchedLength: 3, rank: 2, params: {} },
        { matchedLength: 1, rank: 1, params: {} },
      ])
    })

    it('accepts "a"', function() {
      var m = match('a', matchingTree)
      expect(m).toEqual([{ matchedLength: 1, rank: 1, params: {} }])
    })

    it('partialy accepts "a/c"', function() {
      var m = match('a/c', matchingTree)
      expect(m).toEqual([{ matchedLength: 1, rank: 1, params: {} }])
    })

    it('rejects "c"', function() {
      var m = match('c', matchingTree)
      expect(m).toEqual([])
    })
  })

  describe('[:username/]log', function() {
    var matchingTree = [
      {
        o: [{ p: 'username' }, { s: '/' }],
      },
      { s: 'log' },
    ]

    it('accepts "log"', function() {
      var m = match('log', matchingTree)
      expect(m).toEqual([{ matchedLength: 3, rank: 1, params: {} }])
    })

    it('accepts "jan.noha/log"', function() {
      var m = match('jan.noha/log', matchingTree)
      expect(m).toEqual([{ matchedLength: 12, rank: 3, params: { username: 'jan.noha' } }])
    })
  })
})
