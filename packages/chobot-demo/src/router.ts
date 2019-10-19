import { Router } from 'chobot'
import { AppRoute } from './AppRoute'
import { Homepage } from './components/Homepage'

export const router = new Router(
  new AppRoute({
    name: 'Root',
    children: [
      new AppRoute({
        name: 'Homepage',
        path: '.',
        component: Homepage,
      }),
    ],
  }),
)
