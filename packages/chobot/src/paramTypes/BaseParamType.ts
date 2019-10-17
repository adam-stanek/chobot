import { FilterResult } from './FilterResult'
import { BuiltParamType } from './BuiltParamType'

export class BaseParamType<TValue> {
  protected built: BuiltParamType<TValue>

  constructor(
    filter: (prevResult: FilterResult<string>) => FilterResult<TValue> | null,
    format?: (value: TValue) => string,
  ) {
    this.built = {
      filter,
      format,
    }
  }

  withDefault(value: TValue) {
    this.built.defaultValue = value
    return this
  }

  noEscape() {
    this.built.noEscape = true
    return this
  }

  excluding(blacklist: TValue | TValue[] | ((value: TValue) => boolean) | RegExp) {
    if (typeof blacklist === 'function') {
      const filter = blacklist as (value: TValue) => boolean
      return this.appendFilter(prevResult => (filter(prevResult.value) ? null : prevResult))
    } else if (Array.isArray(blacklist)) {
      return this.appendFilter(prevResult =>
        blacklist.indexOf(prevResult.value) === -1 ? prevResult : null,
      )
    } else if (blacklist instanceof RegExp) {
      return this.appendFilter(prevResult =>
        blacklist.test(prevResult.matchedString) ? null : prevResult,
      )
    } else {
      return this.appendFilter(prevResult => (prevResult.value === blacklist ? null : prevResult))
    }
  }

  protected appendFilter(
    filter: (prevResult: FilterResult<TValue>) => FilterResult<TValue> | null,
  ) {
    var prevFn = this.built.filter
    this.built.filter = value => {
      const prevResult = prevFn(value)
      return prevResult ? filter(prevResult) : null
    }
    return this
  }
}
