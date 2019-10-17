import { FilterResult } from './FilterResult'

export interface BuiltParamType<TValue> {
  defaultValue?: TValue
  noEscape?: true
  filter(prevResult: FilterResult<string>): FilterResult<TValue> | null
  format?(value: TValue): string
}
