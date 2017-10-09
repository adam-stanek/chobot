declare interface RouteOptions {
  path?: string,
  name?: string | number,
  params?: object,
  
  [k: string]: any
}

declare interface Location {
  pathname: string
}

declare namespace DobbyRouter {
  interface FluentParamType {
    __chain: any[]
  }

  interface BaseParamType<T> extends FluentParamType {
    withDefault(defaultValue: any): T
    noEscape(): T
    excluding(filter: (value: any) => boolean | string[] | RegExp | any): T
  }

  interface IntegerParamType extends BaseParamType<IntegerParamType> {
    gt(min: number): IntegerParamType
    gte(min: number): IntegerParamType
    lt(min: number): IntegerParamType
    lte(min: number): IntegerParamType
  }

  interface StringParamType extends BaseParamType<StringParamType> {
    rx(rx: RegExp): StringParamType
  }

  interface DictionaryParamType extends BaseParamType<KeywordsParamType> {

  }

  interface KeywordsParamType extends BaseParamType<KeywordsParamType> {

  }

  const ParamTypes: {
    string: StringParamType
    integer: IntegerParamType
    dict: DictionaryParamType
    keywords: KeywordsParamType
  }

  interface ParamSchema {
    [k: string]: FluentParamType
  }

  // -------

  interface RouteMatch {
    params: object
    routes: Route[]
  }

  class Route {
    name?: string | number
    path?: string
    params?: ParamSchema
    children: Route[]

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
  function routeWalk(routeStack: Route[]): Iterable<Route[]>
}

export = DobbyRouter
