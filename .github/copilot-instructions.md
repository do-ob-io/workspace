# do-ob Workspace - AI Coding Agent Instructions

The workspace uses **language-specific package managers** (`pnpm`, `uv`, `cargo`) within a unified development container.

## Key Workspace Conventions

### File naming conventions
- **Rust**: file names use `snake_case` (e.g. `my_module.rs`)

### Package Structure & Exports
- Node.js packages follow **subpath exports pattern** in package.json (see `@do-ob/core` and `@do-ob/ui`)
- Export main module at `.` and feature submodules like `./strings`, `./base`
- Each submodule has dedicated `index.ts` re-exporting from feature folder
- Example: `@do-ob/core/strings` → `nodejs/core/src/strings/index.ts`

### React & UI Patterns
- **React 19+** with functional components
- React component should be pure functions, no class components
- Hooks for state, effects, and behaviors
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
