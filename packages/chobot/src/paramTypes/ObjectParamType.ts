import { atob, btoa } from 'b2a'
import { BaseParamType } from './BaseParamType'
import { defaultFilter } from './defaultFilter'

export class ObjectParamType extends BaseParamType<any> {
  constructor() {
    super(
      (prevResult) => {
        const r = defaultFilter(prevResult)
        if (r) {
          try {
            r.value = JSON.parse(atob(r.value.replace(/-/g, '+').replace(/_/g, '/')))
            return r
          } finally {
          }
        }

        return null
      },
      (value) => btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
    )
  }
}

export const objectParamTypeFactory = () => new ObjectParamType()
