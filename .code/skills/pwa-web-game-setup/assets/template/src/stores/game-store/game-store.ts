import { create } from 'zustand';

/**
 * Game state store interface.
 */
interface GameState {
  /** Current player score */
  score: number;
  /** Increment the score by 1 */
  incrementScore: () => void;
  /** Reset the score to 0 */
  resetScore: () => void;
}

/**
 * Zustand store for managing game state.
 * Handles player score and game progression.
 */
export const useGameStore = create<GameState>((set) => ({
  score: 0,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  resetScore: () => set({ score: 0 }),
}));
