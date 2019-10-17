import { BaseParamType } from './BaseParamType'
import { defaultFilter } from './defaultFilter'

export class KeywordsParamType extends BaseParamType<string> {
  constructor() {
    super(
      prevResult => {
        const r = defaultFilter(prevResult)
        if (r) {
          r.value = r.value
            .split('--')
            .map(s => s.replace(/-/g, ' '))
            .join('-')
          return r
        }

        return null
      },
      value => {
        return value
          .replace('-', '--')
          .replace(/\s+/g, '-')
          .toLowerCase()
      },
    )
  }
}

export const keywordsParamTypeFactory = () => new KeywordsParamType()
