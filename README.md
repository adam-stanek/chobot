# Chobot router

Chobot router is universal router solution which is completely independent of any framework. It can
easily fit to both React FE applications and NodeJS BE (like Express apps).

## Key differences from other libraries:

**Non-greedy matching**

Router tries to find best possible fit instead of stopping on the first match. This is key feature
in modular applications when you cannot always guarantee order of route registration.

Also it can be quite useful for URL schemes containing routes like:

- `/users/:username`
- and `/users/new-user`.

In this example router is smart enough to match the static route over the one with dynamic username
fragment.

**URL generation**

This library provides utilities for both URL matching and URL construction. It allows you to get rid
of building URL fragments all across your code base and let the route definition to be single source
of truth.

**Custom parameters**

Library supports definition of parameter types. Each parameter can be defined with custom parser
(used for URL match) and formatter (used for URL construction). The parsers are designed as a
"prefix" functions allowing to define nice routes like: `/archive/:year-:month-:day`.

Library comes with several param types bundled and you can easily define your own or just use plain
old
[regular expressions](https://github.com/adam-stanek/chobot/blob/master/test/unit/paramTypes/str.test.ts#L13).

**Optional segments**

Route can contain any number of optional segments. Just put them into brackets like:
`/my-route/:id[/view]`. They can even be nested and contain multiple parameters.

**Zero-copy matching**

Matching uses zero-copy method which helps to keep the memory footprint down as well as it provides
better performance. This makes it especially suitable for backend applications.

**Other mentionable features**

- Rewritten in Typescript (full typings support)
- Battle tested and almost fully covered with tests
- Packaged for both CommonJS and ES6 environments
- Library has close to zero dependencies (just `deep-equal` to not reinvent the wheel)
- You can use it with whatever framework you like

## Example usage

```ts
// Route definitions
// They are defined as a tree-like structure
const rootRoute = new Route(
  {
    name: 'Root',
    path: '/',
  },
  [
    // Index (Homepage)
    new Route({ path: '.', name: 'Homepage' }),
    // About page
    new Route({ path: 'about', name: 'About' }),
    // Article
    new Route({ path: 'articles/:id', name: 'ArticleDetail' }),
  ]
)

// Match URLs
rootRoute.match({ pathname: '/about' })
// Returns {
//   routes: [Route({ name: 'Root', path: '/' }, Route({ name: 'About', path: 'about' }))]
//   params: {}
// }

// Construct URLs
const router = new Router(rootRoute)
router.createUrl('ArticleDetail', { id: 123 }) // Returns '/articles/123'
```

For more advanced examples please take a look at
[/test/examples](https://github.com/adam-stanek/chobot/tree/master/test/examples)

## Development

```bash
# Build
lerna run build:esm
lerna run build:cjs

# Format
lerna run format

# Test
lerna run test -- --color
lerna run test:coverage -- --color
```
