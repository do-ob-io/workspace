# Python projects

## File naming conventions
- File names use `snake_case` (e.g. `my_module.py`)

## Quality instructions

### Typechecking instructions
- Use `ty` as the globally installed typechecker.
- Run `ty check` to type check.
- Run `ty check <path-to-project-or-file>` to type check a specific project or file.

### Linting instructions
- Use `ruff` as the globally installed linter and formatter.
- Run `ruff check --fix` to lint and auto-fix issues.
- Run `ruff check --fix <path-to-project-or-file>` to lint on a specific project or file.
- Run `ruff format` to format all files in the projects.
- Run `ruff format <path-to-project-or-file>` to format a specific project or file.

### Testing instructions
- Use `pytest` as the testing tool.
- Run `uv run pytest` from the root of the workspace to test all projects.
- Run `uv run pytest <path-to-project-or-file>` to test a specific project or file.
- Prefix test files starting with `test_`.
- Colocate test files with their respective source files in a `test/` subfolder.

## Documentation instructions

- Use `pdoc` to generate documentation for Python projects.
- Ensure all APIs are fully documented in clear English before generating documentation.
- Use docstrings with a clear top-level description explaining behavior and purpose.