import { T } from 'chobot/paramTypes'
import { buildParamDescriptors } from 'chobot/paramTypes/buildParamDescriptors'

describe('T.keywords()', () => {
  const { t } = buildParamDescriptors({ t: T.keywords() })

  it('accepts "foo-bar/test"', () => {
    const actual = t.filter('foo-bar/test')
    expect(actual).toEqual({ matchedString: 'foo-bar', value: 'foo bar' })
  })
})
