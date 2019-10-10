import { parsePathExpression } from '~/utils/parsePathExpression'

describe('parsePathExpression', () => {
  it('parses single char expression', () => {
    const actual = parsePathExpression('a')
    expect(actual).toMatchInlineSnapshot(`
Array [
  Object {
    "s": "a",
  },
]
`)
  })

  it("parses 'abc' expression", () => {
    const actual = parsePathExpression('abc')
    expect(actual).toMatchInlineSnapshot(`
Array [
  Object {
    "s": "abc",
  },
]
`)
  })
})
