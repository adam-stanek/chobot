import { isOptionalForParams } from '~/utils/isOptionalForParams'

describe('utils/isOptionalForParams()', function() {
  describe('[/:param1[/:param2]]', function() {
    var matchingTree = {
      o: [
        { s: '/' },
        { p: 'param1' },
        {
          o: [{ s: '/' }, { p: 'param2' }],
        },
      ],
    }

    it('is not optional when both parameters are provided and no default is set', function() {
      expect(isOptionalForParams(matchingTree, { param1: 'foo', param2: 'bar' }, {})).toBe(false)
    })

    it('is optional when param1 is not provided and param2 is equal default value', function() {
      expect(
        isOptionalForParams(matchingTree, { param2: 'bar' }, { param2: { defaultValue: 'bar' } }),
      ).toBe(true)
    })

    it('is optional if none of the parameters is provided', function() {
      expect(isOptionalForParams(matchingTree, {}, {})).toBe(true)
    })

    it('is optional if none of the parameters is provided but there is default value', function() {
      expect(isOptionalForParams(matchingTree, {}, { param2: { defaultValue: 'bar' } })).toBe(true)
    })
  })
})
