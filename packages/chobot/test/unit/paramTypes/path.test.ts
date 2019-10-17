import { T } from '~/paramTypes'
import { buildParamDescriptors } from '~/paramTypes/buildParamDescriptors'

describe('T.path()', () => {
  const { t } = buildParamDescriptors({ t: T.path() })

  it('accepts "foobar"', () => {
    const actual = t.filter('foobar')
    expect(actual).toEqual({ matchedString: 'foobar', value: ['foobar'] })
  })

  it('accepts "foo/bar"', () => {
    const actual = t.filter('foo/bar')
    expect(actual).toEqual({ matchedString: 'foo/bar', value: ['foo', 'bar'] })
  })

  it('formats ["a", "b"]', () => {
    const actual = t.format(['a', 'b'])
    expect(actual).toEqual('a/b')
  })
})
