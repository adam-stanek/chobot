import { BaseParamType } from './BaseParamType'
import { ParamDescriptor } from './ParamDescriptor'

export class PathParamType extends BaseParamType<string[]> {
  constructor() {
    super(
      ({ value }) => {
        const tokens = value.split('/')
        return { matchedString: value, value: tokens }
      },
      value => {
        return value.map(encodeURIComponent).join('/')
      },
    )

    this.noEscape()
  }
}

export const pathParamTypeFactory = () => new PathParamType()
