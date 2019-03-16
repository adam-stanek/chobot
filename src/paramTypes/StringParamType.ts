import { BaseParamType } from './BaseParamType'
import { regExpFilter } from './regExpFilter'
import { defaultFilter } from './defaultFilter'

export class StringParamType extends BaseParamType<string> {
  constructor() {
    super(defaultFilter)
  }

  rx = (rx: RegExp) => this.appendFilter(regExpFilter(rx))
}

export const strParamTypeFactory = () => new StringParamType()
