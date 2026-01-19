---
applyTo: 'nodejs/**/*'
---

# NodeJS projects
Applies to all NodeJS projects.

## File naming conventions
- File names use `kebab-case` for all source files.

## Quality instructions

### Typechecking instructions
- Tool `tsc` (TypeScript Compiler) is globally installed and used for type checking.
- Use `tsc --noEmit` from the root of the workspace to run the type checker.
- Use `tsc --noEmit --project <path-to-tsconfig>` to run the type checker on a specific project.

### Testing instructions
- Tool `vitest` is globally installed and used as the testing framework.
- Use `vitest run` from the root of the workspace to run all tests.
- Use `vitest run <path-to-file>` to run tests from a specific file.
- Test files are colocated with source files and suffixed with `.test.ts` or `.test.tsx`.
- React component stories are colocated with source files and suffixed with `.stories.tsx`.
- React components only need `.stories.tsx` files for Storybook testing.
- React hooks are tested with standard vitest tests with the `.test.tsx` suffix.
- All other tests use the `.test.ts` suffix.

### Linting instructions
- Tool `eslint` is globally installed and used as the linter.
- Use `eslint --fix .` from the root of the workspace to run the linter and auto-fix linting issues.
- Use `eslint --fix <path-to-file>` to run the linter on a specific file.

## Documentation instructions
- Use `pnpm typedoc` to generate TypeDoc documentation for NodeJS projects.
- Ensure all APIs are fully documented in clear English before generating documentation.
- Use JSDoc with a clear top-level description explaining behavior and purpose.
  - `@param` documentation for **every** function argument.
  - `@returns` describing the return value.
  - `@throws` when errors are possible.
  - `@example` for non-trivial or reusable utilities.

## TypeScript instructions
- Use project references (`tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.lib.json`) for the root tsconfig.json.
- Use `tsconfig.build.json` to extend package tsconfig.json but exclude `*.test.*` files.
