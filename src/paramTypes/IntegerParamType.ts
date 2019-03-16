import { BaseParamType } from './BaseParamType'

const INTEGER_RX = /-?[0-9]+/

export class IntegerParamType extends BaseParamType<number> {
  constructor() {
    super(
      ({ matchedString: str }) => {
        let matches = INTEGER_RX.exec(str)
        if (matches && str.indexOf(matches[0]) === 0) {
          return { matchedString: matches[0], value: parseInt(matches[0]) }
        }
        return null
      },
      n => Math.floor(n) + '',
    )
  }

  gt = (min: number) => this.appendFilter(m => (m.value > min ? m : null))
  gte = (min: number) => this.appendFilter(m => (m.value >= min ? m : null))
  lt = (max: number) => this.appendFilter(m => (m.value < max ? m : null))
  lte = (max: number) => this.appendFilter(m => (m.value <= max ? m : null))
}

export const intParamTypeFactory = () => new IntegerParamType()
