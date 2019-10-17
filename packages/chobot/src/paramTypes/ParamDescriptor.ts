import { FilterResult } from './FilterResult'

export interface ParamDescriptor<TValue = unknown> {
  defaultValue?: TValue
  filter(str: string): FilterResult<TValue>
  format(value: TValue): string
}
