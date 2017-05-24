declare interface RouteOptions {
  path?: string,
  name?: string,
  params?: object,
  
  [k: string]: any
}

declare interface Location {
  pathname: string
}

declare namespace DobbyRouter {
  interface RouteMatch {
    params: object
    routes: Route[]
  }

  class Route {
    constructor(options: RouteOptions, children: Route[])
    match(location: Location, index: number): RouteMatch

    // To suppress JSX warning
    render(): any
  }

  class Router {
    rootRoute: Route

    constructor(rootRoute: Route)
    createPathFromRoutes(routes: Route[], params: object): { pathname: string, matchedParams: string[], defaults: object }
    createUrl(name: string, params?: object, hash?: string): string
  }

  function ensureRoute(obj: any): Route
  function *routeWalk(rootRoute: Route)
}

export = DobbyRouter
