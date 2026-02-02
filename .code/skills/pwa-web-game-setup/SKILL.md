````skill
---
name: pwa-web-game-setup
description: Create and configure PWA 3D web game projects with React Three Fiber and Three.js. Use when asked to "create a web game", "setup a game project", "scaffold a PWA game", "new 3D web game", or similar requests for creating installable, offline-capable web games. Projects are created in nodejs/ with game- prefix (e.g., nodejs/game-space-shooter).
---

# PWA Web Game Setup

Create PWA 3D web game projects using React Three Fiber and Three.js with offline support and landscape-optimized gameplay.

## Workflow

1. **Copy template** using `cp -r` command (see below)
2. **Customize configuration** — Replace `{{placeholders}}` in copied files
3. **Install dependencies** with `pnpm install`

## Copy Command

```bash
cp -r /workspace/.code/skills/pwa-web-game-setup/assets/template /workspace/nodejs/game-<name>
```

Replace `<name>` with the kebab-case game name (e.g., `game-space-shooter`, `game-puzzle-quest`).

**Important:**
- Project folder MUST be in `nodejs/` directory
- Folder name MUST be kebab-case prefixed with `game-` (e.g., `game-my-awesome-game`)

## Project Structure

```
nodejs/game-<name>/
├── AGENTS.md
├── README.md
├── package.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── pwa-assets.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── index.css
    ├── game/           # 3D engine components
    │   └── index.ts
    ├── ui/             # HUD overlay components
    │   └── index.ts
    ├── stores/         # Zustand state
    │   └── index.ts
    └── hooks/          # Custom React hooks
        └── index.ts
```

## Customization Checklist

After copying template, replace `{{placeholders}}` in these files:

| File | Placeholder | Example Value |
|------|-------------|---------------|
| `package.json` | `{{project-name}}` | `game-space-shooter` |
| `vite.config.ts` | `{{Project Name}}`, `{{Short Name}}`, `{{Project description}}` | `Space Shooter`, `Space Shooter`, `A 3D space shooter...` |
| `index.html` | `{{Project Name}}` | `Space Shooter` |
| `AGENTS.md` | `{{project-name}}`, `{{Project description...}}` | `game-space-shooter`, actual description |
| `README.md` | `{{project-name}}`, `{{Project description...}}` | `game-space-shooter`, actual description |
| `public/favicon.svg` | Replace with game-specific icon |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `three` | 3D graphics engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Three.js helpers and utilities |
| `motion` | Animations for UI and 3D |
| `zustand` | State management |
| `vite-plugin-pwa` | PWA support |

## Architecture Patterns

### Canvas Setup

```tsx
import { Canvas } from '@react-three/fiber';

function Game() {
  return (
    <Canvas style={{ position: 'fixed', inset: 0 }}>
      <Scene />
    </Canvas>
  );
}
```

### Zustand Store

```tsx
import { create } from 'zustand';

interface GameState {
  score: number;
  incrementScore: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
}));
```

### UI Overlay

```tsx
function HUD() {
  const score = useGameStore((state) => state.score);
  return (
    <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 10 }}>
      Score: {score}
    </div>
  );
}
```

## Quality Commands

Run from `nodejs/game-<name>/` directory:

- **Typecheck**: `tsc --noEmit`
- **Lint**: `eslint --fix`
- **Test**: `vitest run`
- **Build**: `pnpm build`
- **Dev**: `pnpm dev`
````
