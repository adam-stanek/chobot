import { MatchingNode } from './MatchingNode'

/**
 * Determine if fragment is optional for given set of params
 */
export function isOptionalForParams(
  matchingNode: MatchingNode,
  params: { [k: string]: any },
  paramTypes: { [k: string]: { defaultValue?: any } },
) {
  if (matchingNode.s) return true

  if (matchingNode.p) {
    var defaultValue = paramTypes[matchingNode.p]
      ? paramTypes[matchingNode.p].defaultValue
      : undefined
    return params[matchingNode.p] === undefined || params[matchingNode.p] === defaultValue
  }

  if (matchingNode.o) {
    for (var i = 0; i < matchingNode.o.length; i++) {
      if (!isOptionalForParams(matchingNode.o[i], params, paramTypes)) return false
    }

    return true
  }
}
