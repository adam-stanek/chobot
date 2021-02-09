import { dictParamTypeFactory } from './DictionaryParamType'
import { intParamTypeFactory } from './IntegerParamType'
import { keywordsParamTypeFactory } from './KeywordsParamType'
import { objectParamTypeFactory } from './ObjectParamType'
import { pathParamTypeFactory } from './PathParamType'
import { strParamTypeFactory } from './StringParamType'

export { BaseParamType } from './BaseParamType'

export const T = {
  get str() {
    return strParamTypeFactory
  },
  get int() {
    return intParamTypeFactory
  },
  get dict() {
    return dictParamTypeFactory
  },
  get keywords() {
    return keywordsParamTypeFactory
  },
  get path() {
    return pathParamTypeFactory
  },
  get obj() {
    return objectParamTypeFactory
  }
}
