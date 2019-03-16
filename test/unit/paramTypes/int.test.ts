import { buildParamDescriptors } from '~/paramTypes/buildParamDescriptors'
import { T } from '~/paramTypes'

describe('T.int()', () => {
  const { t } = buildParamDescriptors({ t: T.int() })

  it('accepts "18foobar"', () => {
    const actual = t.filter('18foobar')
    expect(actual).toEqual({ matchedString: '18', value: 18 })
  })
})
