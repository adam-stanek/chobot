import { MatchingNode } from './MatchingNode'

function findBracketOrParam(str: string, index: number) {
  for (var i = index; i < str.length; i++) {
    switch (str[i]) {
      case '[':
      case ']':
      case ':':
        return i
    }
  }

  return -1
}

const RX_PARAM_END = /[^a-zA-Z0-9]/
function findParamEnd(str: string, index: number) {
  if (index >= 0) {
    var index2 = str.substring(index).search(RX_PARAM_END)
    return index2 >= 0 ? index + index2 : index2
  } else return str.search(RX_PARAM_END)
}

/**
 * Parse Route's path expression into matching tree.
 * @throws Will throw an error if expression contains unbalanced brackets.
 */
export function parsePathExpression(expr: string) {
  var k: ':' | 'p' | 's'
  var obj: MatchingNode = { o: [] }
  var stack = [obj]
  var index = 0,
    index2
  while (true) {
    index2 =
      index > 0 && expr[index - 1] === ':'
        ? findParamEnd(expr, index)
        : findBracketOrParam(expr, index)

    if (index2 >= 0) {
      if (index != index2) {
        k = index > 0 && expr[index - 1] === ':' ? 'p' : 's'
        stack[stack.length - 1].o!.push({ [k]: expr.substring(index, index2) })
      }

      switch (expr[index2]) {
        case '[':
          obj = { o: [] }
          stack[stack.length - 1].o!.push(obj)
          stack.push(obj)
          index = index2 + 1
          break

        case ']':
          if (stack.length > 1) {
            stack.pop()
            index = index2 + 1
            break
          } else throw new Error('Unmatched bracket found at ' + index2 + '.')

        case ':':
          index = index2 + 1
          break

        default:
          index = index2
      }
    } else break
  }

  if (stack.length !== 1) throw new Error(`Unmatched bracket in expression '${expr}'.`)

  if (index < expr.length - 1) {
    k = index > 0 && expr[index - 1] === ':' ? 'p' : 's'
    stack[0].o!.push({ [k]: expr.substring(index) })
  }

  return stack[0].o
}
