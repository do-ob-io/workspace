# {{project-name}}

{{Project description - a PWA 3D web game built on Three.js and React Three Fiber.}}

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── game/       # 3D game engine components and systems
├── ui/         # HUD overlay components using traditional web elements
├── stores/     # Zustand state management
├── hooks/      # Custom React hooks for game logic
public/         # Static assets (textures, videos, 3D models)
```

## Technical Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript 5.x |
| UI Framework | React 19 |
| 3D Graphics | Three.js, @react-three/fiber, @react-three/drei |
| Animation | motion |
| State | Zustand |
| Build | Vite with React Compiler |
| PWA | vite-plugin-pwa, Workbox |

## Key Features

- **Offline Support**: Service worker caches assets for offline gameplay
- **Installable**: Add to home screen on mobile and desktop
- **Landscape-Optimized**: Designed for horizontal gameplay orientation
- **Full Viewport 3D Canvas**: Immersive rendering with React Three Fiber
- **HUD Overlay**: Traditional web UI components over the 3D scene
- **Responsive**: Adapts to all screen sizes and orientations

## Architecture Overview

### 3D Rendering

The game uses `@react-three/fiber` for declarative Three.js rendering inside React. The canvas fills the viewport, with `@react-three/drei` providing utilities for camera controls, loaders, and effects.

### State Management

Zustand stores manage both game state (player, world, progression) and UI state (menus, HUD, settings) with minimal re-renders.

### Animations

The `motion` library handles animations for both 2D UI elements and 3D objects, supporting spring physics, keyframes, and gesture-based interactions.

### UI Layer

HTML/CSS UI components overlay the 3D canvas using absolute positioning, following responsive design and WCAG accessibility guidelines.
