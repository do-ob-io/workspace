# How we optimized package imports in Next.js

Shu Ding, Software Engineer | Oct 13, 2023 | 5 min read

40% faster cold boots and 28% faster builds. In the latest version of Next.js, we've made improvements to optimize package imports, improving both local dev performance and production cold starts, when using large icon or component libraries or other dependencies that re-export hundreds or thousands of modules.

This post explains why this change was needed, how we've iterated towards our current solution, and what performance improvements we've seen.

## What is a barrel file?

A barrel file in JavaScript is a way to group and export multiple modules from a single file. It allows for easier importing of the grouped modules by providing a centralized location to access them.

For example, let's say we have three modules (`module1.js`, `module2.js`, `module3.js`) within a `utils/` directory. We can create a barrel file named `index.js` within the same directory:

```js
// index.js
export { default as module1 } from './module1'
export { default as module2 } from './module2'
export { default as module3 } from './module3'
```

Now, instead of importing each module individually like this in your application:

```js
import module1 from './utils/module1'
import module2 from './utils/module2'
import module3 from './utils/module3'
```

We can import all modules collectively using the barrel file, without needing to know about the internal structure:

```js
import { module1, module2, module3 } from './utils'
```

Barrel files can improve code organization and maintainability by providing an easily accessible interface for related modules. Because of this, it's used widely by JavaScript packages, especially icon and component libraries.

Some popular icon and component libraries have up to 10,000 re-exports in their entry barrel file.

## What's the problem with barrel files?

There's a hidden cost with JavaScript runtimes in every `require(...)` and `import '...'`. If you want to use one single export from a barrel file that imports thousands of other things, you are still paying the price of importing other unneeded modules.

For many popular React packages, it takes 200~800ms just to import them. In some extreme cases, it can take a few seconds. These slowdowns affect both local development and production performance, especially in a serverless environment. Every time the app is started, we'll have to import everything again.

## Can't we tree-shake it?

Tree-shaking is a bundler feature (Webpack, Rollup, Parcel, esbuild, etc.), not a JavaScript runtime feature. If the library is marked as `external`, it remains a black box. The bundler can't do optimizations inside that box because the dependency would be required at runtime instead.

If we choose to bundle the library together with the application code, tree-shaking will work if the import doesn't have side effects (`sideEffects` in `package.json`). However, it will take more time to compile all modules, analyze the whole module graph, and then tree-shake properly. This causes substantially slower builds.

## Our first attempt: `modularizeImports`

The first approach we tried in Next.js was called modularizeImports. This option allows you to configure the mapping relationship of exported names and their original module paths behind a package's barrel file entrypoint.

For example, if the package `my-lib` has this `index.js` as the entry:

```js
// my-lib/index.js
export { default as module1 } from './module1'
export { default as module2 } from './module2'
export { default as module3 } from './module3'
```

We can configure a compiler transform of `my-lib/{{member}}`, which tells Next.js to change the user's import `import { module2 } from 'my-lib'` into `import module2 from 'my-lib/module2'`. This means we can skip the barrel file and directly import from the target, preventing loading unnecessary modules.

This change makes both the build time and runtime fast. However, this configuration is based on the internal directory structure of the library, and is configured heavily by hand. There are millions of `npm` packages with different versions, and there's no way to scale with this solution efficiently.

If the bundler includes a default configuration for popular libraries without locking down the library's version, this will make the import transformation invalid when the internal structure of that lib changes in the future. We needed a better solution.

## New solution: `optimizePackageImports`

To solve the remaining difficulties of configuring the `modularizeImports` option, we've introduced a new `optimizePackageImports` option to do it automatically in Next.js 13.5.

To start, you can configure which packages to opt in:

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ["my-lib"]
  }
}
```

When this option is enabled, Next.js will analyze the entry file of `my-lib` and figure out if it's a barrel file. If so, it analyzes the file on the fly and automatically maps all imports, similarly to how `modularizeImports` works.

This process is cheaper than tree-shaking, since it only scans the entry barrel files in one pass. It also recursively handles nested barrel files and wildcard exports (`export * from`), and bails out of the process when hitting a non-barrel file.

Since this new option doesn't depend on the package's internal implementations, we pre-configured a list of common libraries that immediately benefit from this, such as `lucide-react` and `@headlessui/react.`

In the future, we're exploring ideas to automatically tell if a package should be opted-in or not. For now, the list can keep expanding as the community and our team discover new packages to optimize.

## Measuring performance improvements

### Local development

In our local benchmarking on a M2 MacBook Air, when using one of the most popular icon or component libraries, we are seeing a 15%~70% development time boost depending on the actual library:

- `@mui/material`: 7.1s (2225 modules) → 2.9s (735 modules) (-4.2s)
- `recharts`: 5.1s (1485 modules) → 3.9s (1317 modules) (-1.2s)
- `@material-ui/core`: 6.3s (1304 modules) → 4.4s (596 modules) (-1.9s)
- `react-use`: 5.3s (607 modules) → 4.4s (337 modules) (-0.9s)
- `lucide-react`: 5.8s (1583 modules) → 3s (333 modules) (-2.8s)
- `@material-ui/icons`: 10.2s (11738 modules) → 2.9s (632 modules) (-7.3s)
- `@tabler/icons-react`: 4.5s (4998 modules) → 3.9s (349 modules) (-0.6s)
- `rxjs`: 4.3s (770 modules) → 3.3s (359 modules) (-1.0s)

These time savings are for the initial boot in local dev, but they also affect the speed of Hot Module Replacement (HMR), letting live local dev feel much faster. The numbers add up quickly if you are using multiple libraries with many sub-modules.

### Production builds

In a benchmark of a Next.js App Router page with `lucide-react` and `@headlessui/react`, built on a M2 MacBook Air, `next build` runs ~28% faster because it no longer needs to do module resolution and tree-shaking.

### Faster cold boots

In a local environment, we're seeing the Node.js server start ~10% faster when rendering a simple route that uses `lucide-react` and `@headlessui/react`.

In a serverless environment like Vercel, this decreases both the deployed code size and the number of Node.js `require` calls. We've measured up to 40% faster cold starts paired with other improvements included in Next.js 13.5.

### Recursive Barrel Files

The last change we've made handles recursive barrel files, optimizing them into a single module. To test, we created a module with 4 levels of 10 `export *` expressions, equaling 10,000 modules in total.

Before, this recursive package would take ~30 seconds to compile. After, it's just ~7s. We've seen 90% faster reloads from some customers with over 100,000 modules.

## Conclusion

We recommend upgrading to the latest version of Next.js to see significant performance improvements in local dev performance and production cold starts. You might also consider adding an ESLint rule to prevent barrel file imports.
