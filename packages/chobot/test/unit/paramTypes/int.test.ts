import { T } from 'chobot/paramTypes'
import { buildParamDescriptors } from 'chobot/paramTypes/buildParamDescriptors'

describe('T.int()', () => {
  const { t } = buildParamDescriptors({ t: T.int() })

  it('accepts "18foobar"', () => {
    const actual = t.filter('18foobar')
    expect(actual).toEqual({ matchedString: '18', value: 18 })
  })
})
