import { FilterResult } from './FilterResult'

export function regExpFilter(
  rx: RegExp,
): (filter: FilterResult<string>) => FilterResult<string> | null {
  return value => {
    let str = typeof value === 'object' && value ? value.value : value
    let m = rx.exec(str)
    if (m && str.indexOf(m[0]) === 0)
      return { matchedString: m[0], value: decodeURIComponent(m[0]) }

    return null
  }
}
