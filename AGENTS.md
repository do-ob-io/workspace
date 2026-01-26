# do-ob workspace

- If it exists, reference the `AGENTS.md` file for project specific instructions.

# General Rules (CRITICAL)
- When given the instructions to build a feature, you must implement it in the following steps:
  1. **Planning**: Asking questions to clarify requirements and constraints, listing tasks, and creating a plan
  2. **Implementing**: Writing organized code to implement the feature according to the plan
  3. **Testing**: Writing unit tests to verify the feature works as intended
  4. **Quality Checking**: Running typechecks, linters, tests, and build to ensure code quality
  5. **Completion**: Output of clear and concise summary of the work done
- Only use the quality tools provided in the agent instructions after finishing development tasks
- Never run background processes like development servers
- Always additionally reference the `AGENTS.md` file in the project being worked.

## Workspace overview
- Projects are organized into folders by their primary language: `python/`, `nodejs/`, `rust/`
- Projects can be applications, libraries, or tools
- `container/` projects use `docker`
- `nodejs/` projects use `pnpm`
- `python/` projects use `uv`
- `rust/` projects use `cargo`

## Quality check instructions (CRITICAL)
- Run quality checks in the following order:
  1. Typecheck
  2. Lint
  3. Test
  4. Build (if applicable)
- Before completing an update or change, run all quality checks in a project
- Path the quality tools at the appropriate depth given the task (workspace root, project root, specific file)

## Filename rules (CRITICAL)
- JavaScript and TypeScript use `kebab-case` for files.
- Python uses `snake_case` for files.
- Rust uses `snake_case` for files.

## NodeJS Specific Guidance (CRITICAL)
- Always put new source code in their own directory with the same name as the source file
- Always colocate related files within the same directory (e.g., tests, styles, types)
- Always create or update the `index.ts` file in each directory that exports the public APIs
- React components must export a single component per file
- Always create storybook stories for React component tests

### NodeJS shared project libraries (IMPORTANT)
- `nodejs/core/`: Shared common utilities
- `nodejs/hook/`: Shared React hooks
- `nodejs/ui/`: Shared user interface React components
- Create new common features for reuse across multiple NodeJS projects
- If a shared package is missing, clone it into the `nodejs` folder from GitHub `git clone git@github.com:do-ob-io/<project-name>.git`

### NodeJS quality tools (CRITICAL)
- **Tools are globally installed** - Run commands directly without `pnpm` or `npx` prefix unless explicitly shown
- `cd` to the appropriate project directory before running commands

| Type | Base Command | Description | Instructions |
|------|--------------|-------------|--------------|
| Typechecking | `tsc --noEmit` | TypeScript Compiler | `cd` to specific project |
| Linting | `eslint --fix`, `eslint --fix <path-to-file>` | Linter and auto-fixer | Use from workspace root or specific project |
| Testing | `vitest run`, `vitest run <path-to-file>` | Testing framework | Use from workspace root or specific project |
| Build | `pnpm build` | Build the project | `cd` to specific project |
| Documentation | `pnpm typedoc` | TypeDoc documentation generator | Use from workspace root |

### NodeJS documentation (CRITICAL)
- Use JSDoc with a clear top-level description explaining behavior and purpose.
  - `@param` documentation for **every** function argument.
  - `@returns` describing the return value.
  - `@throws` when errors are possible.
  - `@example` for non-trivial or reusable utilities.

## Python specific guidance (CRITICAL)

### Python quality tools (CRITICAL)

| Type | Base Command | Description | Instructions |
|------|--------------|-------------|--------------|
| Typechecking | `ty check` | Typechecker | Use from workspace root or specific project |
| Linting | `ruff check --fix`, `ruff check --fix <path-to-file>` | Linter and auto-fixer | Use from workspace root or specific project |
| Testing | `uv run pytest`, `uv run pytest <path-to-file>` | Testing framework | Use from workspace root or specific project |
| Documentation | `uv doc` | Documentation generator | Use from project root |
