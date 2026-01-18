# do-ob Workspace

- Reference any relevant nested `AGENT.md` files along the working directory for files being worked on.

## Workspace Overview

- Projects are organized into folders by their primary language: `python/`, `nodejs/`, `rust/`.
- Projects can be applications, libraries, or tools.
- `container/` projects use `docker`.
- `nodejs/` projects use `pnpm`.
- `python/` projects use `uv`.
- `rust/` projects use `cargo`.

## Quality instructions

- Run quality checks in the following order:
  1. Typecheck
  2. Lint
  3. Test
- Before completing an update or change, run all quality checks in a project.
- Path the quality tools at the appropriate depth given the task (workspace root, project root, specific file).
