import { BaseParamType } from './BaseParamType'
import deepEqual from 'deep-equal'

export class DictionaryParamType<T extends { [k: string]: any }> extends BaseParamType<T[keyof T]> {
  constructor(dictionary: T) {
    super(
      ({ value }) => {
        let m
        for (let k in dictionary) {
          if (value.lastIndexOf(k, 0) === 0 && (!m || m.length < k.length)) m = k
        }

        return m ? { matchedString: m, value: dictionary[m] } : null
      },
      value => {
        for (var k in dictionary) {
          if (deepEqual(dictionary[k], value)) return k
        }

        return value
      },
    )
  }
}

export const dictParamTypeFactory = <T extends { [k: string]: any }>(dictionary: T) =>
  new DictionaryParamType<T>(dictionary)
