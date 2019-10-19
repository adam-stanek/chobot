import { LocationMatch, Route } from 'chobot/Route'

/**
 * Returns true if given routes can be considered as active for given match.
 *
 * @param actual
 * @param active
 * @param ignoreIndices If true, index routes will be skipped while matching.
 */
export function isRouteActive(
  actual: { routes: Route[]; params?: { [k: string]: any } },
  active: LocationMatch,
  ignoreIndices = true,
) {
  for (
    let i =
      actual.routes.length -
      (ignoreIndices && actual.routes[actual.routes.length - 1].path === '.' ? 2 : 1);
    i >= 0 && i < active.routes.length;
    i--
  ) {
    if (actual.routes[i] === active.routes[i]) {
      if (actual.params) {
        for (const k in actual.params) {
          if (actual.params[k] !== undefined) {
            if (active.params[k] !== undefined) {
              if (active.params[k] !== actual.params[k]) {
                return false
              }
            } else if (active.queryParams[k] !== actual.params[k]) {
              return false
            }
          }
        }
      }

      return true
    }
  }

  return false
}
