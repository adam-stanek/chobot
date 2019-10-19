import { Router } from 'chobot'
import { AppRoute } from './AppRoute'
import { Homepage } from './components/Homepage'

export const router = new Router(
  new AppRoute({
    children: [
      new AppRoute({
        name: 'Homepage',
        path: '.',
        component: Homepage,
      }),
    ],
  }),
)
