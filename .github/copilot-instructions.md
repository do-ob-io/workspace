# do-ob Workspace - AI Coding Agent Instructions

## Architecture Overview

This is a **multi-language monorepo** workspace organized by language:
- `nodejs/*` - Node.js/TypeScript packages managed by pnpm workspace
- `python/*` - Python projects managed by uv workspace
- `rust/*` - Rust crates managed by Cargo workspace
- `docs/` - Auto-generated TypeDoc markdown documentation

The workspace uses **language-specific package managers** (`pnpm`, `uv`, `cargo`) within a unified development container.

## Key Workspace Conventions

### File naming conventions
- **Node.js/TypeScript**: file names use `kebab-case` (e.g. `my-component.tsx`)
- **Python**: file names use `snake_case` (e.g. `my_module.py`)
- **Rust**: file names use `snake_case` (e.g. `my_module.rs`)

### Package Structure & Exports
- Node.js packages follow **subpath exports pattern** in package.json (see `@do-ob/core` and `@do-ob/ui`)
- Export main module at `.` and feature submodules like `./strings`, `./base`
- Each submodule has dedicated `index.ts` re-exporting from feature folder
- Example: `@do-ob/core/strings` → `nodejs/core/src/strings/index.ts`

## Node.js TypeDoc Rules

All **public exports** must be fully documented for TypeDoc.

**Required:**
- A clear top-level description explaining behavior and purpose
- `@param` documentation for **every** function argument
- `@returns` describing the return value
- `@throws` when errors are possible
- `@example` for non-trivial or reusable utilities

**Types & Interfaces:**
- Require a top-level description
- Document non-obvious fields

**Style:**
- Clear, concise English
- Describe behavior, not implementation
- Do not rely on type names alone

**Enforcement:**
- Undocumented public APIs are considered incomplete
- Tests passing is not sufficient—documentation is mandatory

### TypeScript Configuration Strategy
- **Root tsconfig.json** uses project references (tsconfig.app.json, tsconfig.node.json, tsconfig.lib.json)
- **Package tsconfig.build.json** extends package tsconfig.json but excludes `*.test.*` files
- Build command: `tsc -p ./tsconfig.json` (builds excluding tests via tsconfig.build.json)

### Testing & Development Workflow
- **Vitest with multi-project setup** configured in root vite.config.ts:
  - `node` project: runs `nodejs/**/*.test.ts` in Node environment
  - `storybook` project: runs Storybook tests in browser with Playwright
- Run all tests: `pnpm test` (executes vitest from root)
- Individual package tests: `cd nodejs/core && pnpm test`

### Code Style & Linting
- **ESLint flat config** (eslint.config.mjs) with strict stylistic rules:
  - Semicolons required, single quotes for JS/TS, double quotes for JSX
  - 2-space indentation enforced by @stylistic plugin
  - Import ordering: builtin → external → internal → parent → sibling, alphabetized with newlines between groups
  - TypeScript: consistent-type-imports enforced (use `import type` for types)
- **Python**: Ruff configured with strict ALL ruleset in pyproject.toml, 2-space indent
- **Rust**: Standard Rust 2024 edition formatting

### React & UI Patterns
- Uses **Base UI** (@base-ui/react) as primitive component foundation
- **class-variance-authority** (cva) for variant-based styling (see [button.tsx](nodejs/ui/src/base/button.tsx))
- `cn()` utility ([utils.ts](nodejs/ui/src/utils.ts)) combines clsx + tailwind-merge for className composition
- Tailwind v4 with @tailwindcss/vite plugin integration
- **Storybook** at root for component development/testing

### Documentation Generation
- **TypeDoc** generates markdown docs to `docs/` directory
- Configured for monorepo packages strategy in typedoc.json
- Entry points: `nodejs/*/src/*/index.ts` (feature-based modules)
- Run: `pnpm typedoc` (uses typedoc-plugin-markdown)

### Node.js Development Environment
- **Node.js 25.2.1** (strict version in package.json engines)
- Uses **rolldown-vite** (vite override): `npm:rolldown-vite@7.2.5`
- Dev container includes: Git, Docker CLI, Git LFS, Node.js/pnpm, Python3/pip, Rust toolchain

## When Creating New Node.js Files

- **TypeScript files**: Include in appropriate tsconfig, use `import type` for types
- **React components**: Use Base UI primitives, cva for variants, export props type
- **Node Tests**: Suffix with `.test.ts` or `.test.tsx`, auto-excluded from build
- **React Tests**: Use Storybook + Playwright for UI components
- **Exports**: Add subpath export to package.json if creating new feature module
- **Documentation**: Will auto-generate on next `pnpm typedoc` run if properly exported

## Critical Node.js Patterns to Follow

1. **No param reassign**: ESLint enforces `no-param-reassign: error`
2. **Import cycles prohibited**: `import-x/no-cycle` enforced
3. **Unused vars**: Prefix with `_` if intentionally unused (TypeScript/Python)
4. **Prefer read-only props**: React rule enforces immutable props pattern
5. **Case normalization**: Use `normalizeCase()` from @do-ob/core/strings before case transformations
