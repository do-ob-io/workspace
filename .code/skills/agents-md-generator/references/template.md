# AGENTS.md Template

Use this template when generating AGENTS.md files. Replace placeholders with analyzed values.

```markdown
# <Project Name> <Library|Application|Tool>

<1-2 sentence description of what the project does and its purpose>

## Quality Instructions

- **Typecheck**: `<command>`
- **Lint**: `<command>`
- **Test**: `<command>`
- **Build**: `<command>`

## Structure

- `<dir>/` — <purpose>

## Technical Stack

- **Language**: <language>
- **Framework**: <framework>
- **Key Libraries**: <libraries>
- **Build Tool**: <tool>
```

## Field Guidelines

| Field | Include When | Omit When |
|-------|--------------|-----------|
| Framework | Project uses a framework (React, Django, etc.) | Pure utility or no framework dependency |
| Key Libraries | There are 2+ impactful non-framework deps | Only standard library usage |
| Build Tool | Non-standard build (tsup, esbuild, webpack) | Standard toolchain (tsc, cargo build) |

## Classification Rules

- **Library**: Has `exports` field, publishes to registry, no executable entry
- **Application**: Has server, UI, or runnable `main`
- **Tool**: Has `bin` field or CLI interface
