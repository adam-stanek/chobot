import { defaultFilter } from '~/paramTypes/defaultFilter'
import { ParamDescriptor } from '~/paramTypes/ParamDescriptor'
import { MatchingNode } from './MatchingNode'

export interface Match {
  matchedLength: number
  rank: number
  params: { [k: string]: any }
}

// Matcher
export function match(
  str: string,
  matchingTree: MatchingNode[],
  paramTypes: { [k: string]: ParamDescriptor } = {},
  strIndex = 0,
  treeIndex = 0,
  rank = 0,
) {
  var params = {} as { [k: string]: any }
  var matches: Match[] = []
  var initialStrIndex = strIndex

  for (var i = treeIndex; i < matchingTree.length; i++) {
    // Fixed string
    if (matchingTree[i].s) {
      // If string starts at the index we move the index by substring length
      // If not we are in the dead end.
      if (str.lastIndexOf(matchingTree[i].s!, strIndex) == strIndex) {
        strIndex += matchingTree[i].s!.length
        rank++
      } else return matches
    }

    // Parameter
    else if (matchingTree[i].p) {
      // Try to apply parameter filter
      const s = strIndex > 0 ? str.substring(strIndex) : str
      let f = paramTypes[matchingTree[i].p!]
        ? paramTypes[matchingTree[i].p!].filter(s)
        : defaultFilter({ matchedString: s, value: s })

      // Is parameter valid?
      // If so we move the index by matched length.
      // If not we are in the dead end.
      if (f) {
        params[matchingTree[i].p!] = f.value
        strIndex += f.matchedString.length
        rank++
      } else return matches
    }

    // Optional fragment
    else if (matchingTree[i].o) {
      // Try to match the optional subtree
      let m = match(str, matchingTree[i].o!, paramTypes, strIndex, 0, rank)

      // For each subtree match check if we can continue with it
      for (var j = 0; j < m.length; j++) {
        let params2 = Object.assign({}, params, m[j].params)

        let m2 = match(
          str,
          matchingTree,
          paramTypes,
          strIndex + m[j].matchedLength,
          i + 1,
          m[j].rank,
        )
        for (var k = 0; k < m2.length; k++) {
          matches.push({
            matchedLength: m2[k].matchedLength + m[j].matchedLength + strIndex - initialStrIndex,
            rank: m2[k].rank,
            params: Object.assign({}, params2, m2[k].params),
          })
        }
      }
    }
  }

  // Only accept if we matched the whole dirname and not just part of it
  if (
    strIndex === initialStrIndex ||
    strIndex === str.length ||
    str[strIndex] === '/' ||
    str[strIndex - 1] === '/'
  ) {
    matches.push({
      matchedLength: strIndex - initialStrIndex,
      rank,
      params,
    })
  }

  return matches
}
