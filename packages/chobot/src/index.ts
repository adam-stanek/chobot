export * from './Router'
export * from './paramTypes'
export * from './utils/routeWalk'
export * from './utils/isRouteActive'

import { Route } from './Route'
import { ensureRoute as ensureRouteFactory } from './utils/ensureRoute'

export const ensureRoute = (obj: any) => ensureRouteFactory(Route, obj)
export { Route }
