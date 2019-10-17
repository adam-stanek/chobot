import { T } from 'chobot/paramTypes'
import { buildParamDescriptors } from 'chobot/paramTypes/buildParamDescriptors'

describe('T.str()', () => {
  const { t } = buildParamDescriptors({ t: T.str() })

  it('accepts "foobar"', () => {
    const actual = t.filter('foobar')
    expect(actual).toEqual({ matchedString: 'foobar', value: 'foobar' })
  })
})

describe('T.string.rx(/[abcd]+/)', () => {
  const { t } = buildParamDescriptors({ t: T.str().rx(/[abcd]+/) })

  it('accepts "abcd"', function() {
    expect(t.filter('abcd')).toEqual({
      matchedString: 'abcd',
      value: 'abcd',
    })
  })

  it('rejects "_abcd"', function() {
    expect(t.filter('_abcd')).toBeNull()
  })
})

describe('ParamTypes.string.excluding("foo")', function() {
  const { t } = buildParamDescriptors({ t: T.str().excluding('foo') })

  it('accepts "foobar"', function() {
    expect(t.filter('foobar')).toEqual({
      matchedString: 'foobar',
      value: 'foobar',
    })
  })

  it('rejects "foo"', function() {
    expect(t.filter('foo')).toBeNull()
  })
})

describe('ParamTypes.string.excluding(/[abcd]+/)', function() {
  const { t } = buildParamDescriptors({ t: T.str().excluding(/[abcd]+/) })

  it('accepts "efgh"', function() {
    expect(t.filter('efgh')).toEqual({
      matchedString: 'efgh',
      value: 'efgh',
    })
  })

  it('rejects "abcd"', function() {
    expect(t.filter('abcd')).toBeNull()
  })
})

describe('ParamTypes.string.excluding(["alice", "bob"])', function() {
  const { t } = buildParamDescriptors({ t: T.str().excluding(['alice', 'bob']) })

  it('accepts "charlie"', function() {
    expect(t.filter('charlie')).toEqual({
      matchedString: 'charlie',
      value: 'charlie',
    })
  })

  it('rejects "alice"', function() {
    expect(t.filter('alice')).toBeNull()
  })

  it('rejects "bob"', function() {
    expect(t.filter('bob')).toBeNull()
  })
})

describe('ParamTypes.string.excluding((v) => v.length % 2)', function() {
  const { t } = buildParamDescriptors({ t: T.str().excluding(v => v.length % 2 > 0) })

  it('accepts "adam"', function() {
    expect(t.filter('adam')).toEqual({
      matchedString: 'adam',
      value: 'adam',
    })
  })

  it('rejects "bob"', function() {
    expect(t.filter('bob')).toBeNull()
  })
})
