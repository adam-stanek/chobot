import { buildParamDescriptors } from '~/paramTypes/buildParamDescriptors'
import { T } from '~/paramTypes'

describe('T.dict({ "a": 1, "a/b": 2 }).noEscape()', () => {
  const { t } = buildParamDescriptors({ t: T.dict({ a: 1, 'a/b': 2 }).noEscape() })

  it('accepts "a/b"', () => {
    const actual = t.filter('a/b')
    expect(actual).toEqual({ matchedString: 'a/b', value: 2 })
  })
})
