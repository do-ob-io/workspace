# NodeJS projects

## File naming conventions
- File names use `kebab-case` (e.g. `my-component.tsx`)

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
- Use JSDoc with a clear top-level description explaining behavior and purpose
  - `@param` documentation for **every** function argument
  - `@returns` describing the return value
  - `@throws` when errors are possible
  - `@example` for non-trivial or reusable utilities

## TypeScript instructions
- Use project references (`tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.lib.json`) for the root tsconfig.json.
- Use `tsconfig.build.json` to extend package tsconfig.json but exclude `*.test.*` files.

## React instructions
- Use React v19 with functional components and hooks.
- Use pure functions, no class components.
- Use hooks for state, effects, and behaviors.
- Use tailwindcss for styling.
- Colocate storybook stories with source files.

### React component boilerplate

```tsx
import React from 'react';

export interface MyComponentProps {
  /** TypeDoc of prop1 */
  prop1: string;
  /** TypeDoc of prop2 */
  prop2?: number;
}

/**
 * TypeDoc description for MyComponent.
 * ...
 */
export const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  // Component logic here (remember to extract complex logic into hooks or utilities)
  return (
    <div>
      {/* JSX markup here */}
    </div>
  );
};
```