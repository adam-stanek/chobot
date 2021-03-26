import { parsePathExpression } from 'chobot/utils/parsePathExpression'

describe('parsePathExpression', () => {
  it("parses 'a'", () => {
    const actual = parsePathExpression('a')
    expect(actual).toEqual([{ s: 'a' }])
  })

  it("parses 'abc'", () => {
    const actual = parsePathExpression('abc')
    expect(actual).toEqual([{ s: 'abc' }])
  })

  it("parses ':id'", () => {
    const actual = parsePathExpression(':id')
    expect(actual).toEqual([{ p: 'id' }])
  })

  it("parses 'foo/:id'", () => {
    const actual = parsePathExpression('foo/:id')
    expect(actual).toEqual([{ s: 'foo/' }, { p: 'id' }])
  })

  it("parses 'foo/:id[/edit]'", () => {
    const actual = parsePathExpression('foo/:id[/edit]')
    expect(actual).toEqual([{ s: 'foo/' }, { p: 'id' }, { o: [{ s: '/edit' }] }])
  })

  it("parses nested optional segments 'foo/:id[/bar/:id[/baz]]'", () => {
    const actual = parsePathExpression('foo/:id[/bar/:id[/baz]]')
    expect(actual).toEqual([
      { s: 'foo/' },
      { p: 'id' },
      { o: [{ s: '/bar/' }, { p: 'id' }, { o: [{ s: '/baz' }] }] },
    ])
  })

  it("fails on  invalid path 'http://10.254.15.33:1337/'", () => {
    expect(() => parsePathExpression('http://10.254.15.33:1337/')).toThrowError()
  })
})
