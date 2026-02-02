import { useGameStore } from '../../stores';

/**
 * Heads-up display overlay for game information.
 * Renders UI elements over the 3D canvas.
 */
export function HUD() {
  const score = useGameStore((state) => state.score);

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 10,
        padding: '8px 16px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      Score: {score}
    </div>
  );
}
