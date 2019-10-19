import { Route, RouteOptions } from 'chobot'

interface AppRouteOptions extends RouteOptions {
  component?: React.ComponentType
}

export class AppRoute extends Route {
  component?: React.ComponentType

  constructor(opts: AppRouteOptions) {
    super(opts)
    this.component = opts.component
  }
}
