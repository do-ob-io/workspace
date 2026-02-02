# {{project-name}} Application

{{Project description - a PWA 3D web game built on Three.js and React Three Fiber.}}

## Quality Instructions

- **Typecheck**: `tsc --noEmit` — Run from project directory
- **Lint**: `eslint --fix` — Auto-fix linting issues
- **Test**: `vitest run` — Execute test suite
- **Build**: `pnpm build` — Production build with PWA assets

## Structure

- `src/game/` — 3D game engine components and systems
- `src/ui/` — HUD overlay components using traditional web elements
- `src/stores/` — Zustand state management
- `src/hooks/` — Custom React hooks for game logic
- `public/` — Static assets (textures, videos, 3D models)

## Technical Stack

- **Language**: TypeScript 5.x with React 19
- **Framework**: Vite with PWA support (offline, installable, landscape-optimized)
- **Key Libraries**: 
  - `three` (3D graphics engine)
  - `@react-three/fiber` (React renderer for Three.js)
  - `@react-three/drei` (Three.js helpers and utilities)
  - `motion` (animations for UI and 3D objects)
  - `zustand` (state management)
- **Build Tool**: Vite (Rolldown) with React Compiler and PWA plugin

## Game Architecture

### Canvas Strategy

- Full viewport 3D canvas using `@react-three/fiber`
- Responsive design adapting to all screen sizes and orientations
- Landscape-optimized for gaming experience
- `@react-three/drei` provides helpers for camera controls, loaders, and effects

### State Management

- `zustand` manages all game state (player state, world state, game progression)
- `zustand` manages UI state (menu visibility, HUD elements, settings)
- Minimal re-renders for optimal 3D performance

### Animations

- `motion` is the primary library for animations across UI and 3D objects
- Use `motion` components for declarative animations on HTML elements and React Three Fiber meshes/groups/lights
- Supports spring physics, keyframes, gestures, and layout animations
- Integrate with `zustand` state for triggering animation variants
- Unified API for both 2D UI transitions and 3D scene animations

### UI HUD

- Traditional web UI overlays the 3D canvas using absolute/fixed positioning
- Responsive design principles for cross-device compatibility
- WCAG accessibility compliance (keyboard navigation, ARIA labels, focus management)
- Minimal performance impact on 3D rendering
- React components for dialogs, menus, health bars, score displays

## Development Notes

- React 19.x features including Compiler for automatic optimization
- PWA configured for offline gameplay and installability
- TypeScript strict mode for type safety
- Colocate tests with source files
- Use kebab-case for file names
- Follow workspace conventions for React components and exports
