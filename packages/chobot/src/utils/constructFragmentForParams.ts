import { defaultFormatter } from 'chobot/paramTypes/defaultFormatter'
import { ParamDescriptor } from 'chobot/paramTypes/ParamDescriptor'
import deepEqual from 'deep-equal'
import { isOptionalForParams } from './isOptionalForParams'
import { MatchingNode } from './MatchingNode'

export interface ConstructedFragment {
  fragment: string
  matchedParams: string[]
}

/**
 * Construct URL fragment for given set of params.
 * @throws Will throw an error if no value is provided for required parameter.
 */
export function constructFragmentForParams(
  matchingTree: MatchingNode[],
  params: { [k: string]: any },
  paramTypes: { [k: string]: ParamDescriptor },
) {
  var result: ConstructedFragment = {
    fragment: '',
    matchedParams: [],
  }

  var v
  var defaultValue

  for (var i = 0; i < matchingTree.length; i++) {
    if (matchingTree[i].s) result.fragment += matchingTree[i].s
    else if (matchingTree[i].p) {
      result.matchedParams.push(matchingTree[i].p!)
      defaultValue = paramTypes[matchingTree[i].p!]
        ? paramTypes[matchingTree[i].p!].defaultValue
        : undefined

      if (matchingTree[i].p! in params) {
        if (!deepEqual(params[matchingTree[i].p!], defaultValue)) {
          v = (paramTypes[matchingTree[i].p!]
            ? paramTypes[matchingTree[i].p!].format
            : defaultFormatter)(params[matchingTree[i].p!])
          if (v !== null) result.fragment += v
          else throw `Invalid value for parameter ${matchingTree[i].p}.`
        }
      } else if (defaultValue === undefined)
        throw `Missing value for parameter ${matchingTree[i].p}.` // intentionally not Error instance
    } else if (!isOptionalForParams(matchingTree[i], params, paramTypes)) {
      let r2 = constructFragmentForParams(matchingTree[i].o!, params, paramTypes)
      result.fragment += r2.fragment
      result.matchedParams.push(...r2.matchedParams)
    }
  }

  return result
}
