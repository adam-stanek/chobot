import { strParamTypeFactory } from './StringParamType'
import { intParamTypeFactory } from './IntegerParamType'
import { dictParamTypeFactory } from './DictionaryParamType'
import { keywordsParamTypeFactory } from './KeywordsParamType'

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
}
