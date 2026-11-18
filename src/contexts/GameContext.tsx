'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { GameState, GameAction, CreatePlayerDTO, UpdatePlayerDTO } from '@/types/game';
import { gameReducer } from '@/reducers/gameReducer';
import { gameStorage } from '@/services/StorageService';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  addPlayer: (name: string) => void;
  updateScore: (playerId: string, score: number) => void;
  startNewRound: () => void;
  resetGame: () => void;
  loadSavedState: () => void;
  clearSavedState: () => void;
  exportGameState: () => string | null;
  importGameState: (jsonString: string) => boolean;
  getStorageInfo: () => { used: number; quota: number; percentage: number } | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const DEFAULT_SETTINGS = {
  maxPlayers: 7,
  eliminationThreshold: 201,
  maxScorePerEntry: 100,
  playerNameMaxLength: 30,
};

const INITIAL_STATE: GameState = {
  players: [],
  currentRound: 1,
  rounds: [],
  settings: DEFAULT_SETTINGS,
  lastUpdated: new Date(),
};

// Throttle function to limit save frequency
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
    return undefined as ReturnType<T>;
  } as T;
}

// Simple toast fallback
const useToastFallback = () => {
  return {
    showToast: (message: string, type?: 'error' | 'warning' | 'info' | 'success', duration?: number) => {
      console.log(`[Toast ${type}]: ${message}`);
    },
  };
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  
  // Try to use toast if available, otherwise use fallback
  let showToast;
  try {
    // Dynamic import to avoid circular dependency
    const { useToast } = require('@/components/ToastNotification');
    showToast = useToast().showToast;
  } catch {
    showToast = useToastFallback().showToast;
  }

  // Load saved state on initial mount
  useEffect(() => {
    const savedState = gameStorage.loadState();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
      showToast('Game state loaded from storage', 'success', 2000);
    } else {
      // Check if storage is available
      if (!gameStorage.isAvailable()) {
        showToast('Local storage is not available. Game data will not be saved between sessions.', 'warning', 5000);
      }
    }
  }, [showToast]);

  // Throttled save function
  const saveState = useCallback(
    throttle((gameState: GameState) => {
      try {
        gameStorage.saveState(gameState);
      } catch (error: any) {
        console.error('Failed to save game state:', error.message);
        showToast('Failed to save game state to storage', 'error', 3000);
      }
    }, 1000), // Save at most once per second
    [showToast]
  );

  // Save state on changes (with throttling)
  useEffect(() => {
    if (state !== INITIAL_STATE) {
      saveState(state);
    }
  }, [state, saveState]);

  const addPlayer = (name: string) => {
    const playerData: CreatePlayerDTO = { name };
    dispatch({ type: 'ADD_PLAYER', payload: playerData });
    showToast(`Player "${name}" added`, 'success', 2000);
  };

  const updateScore = (playerId: string, score: number) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    const playerUpdate: UpdatePlayerDTO = { playerId, score };
    dispatch({ type: 'UPDATE_SCORE', payload: playerUpdate });
    
    const newTotal = player.totalScore + score;
    if (newTotal >= 201) {
      showToast(`${player.name} has been eliminated!`, 'warning', 3000);
    } else {
      showToast(`Score added for ${player.name}`, 'success', 1500);
    }
  };

  const startNewRound = () => {
    dispatch({ type: 'START_NEW_ROUND' });
    showToast(`Round ${state.currentRound + 1} started`, 'info', 2000);
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    showToast('Game reset successfully', 'info', 2000);
  };

  const loadSavedState = () => {
    const savedState = gameStorage.loadState();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
      showToast('Game state loaded from storage', 'success', 2000);
    } else {
      showToast('No saved game state found', 'warning', 2000);
    }
  };

  const clearSavedState = () => {
    gameStorage.clearState();
    dispatch({ type: 'CLEAR_STATE' });
    showToast('All game data cleared', 'info', 2000);
  };

  const exportGameState = (): string | null => {
    const exported = gameStorage.exportState();
    if (exported) {
      showToast('Game state exported successfully', 'success', 2000);
    } else {
      showToast('No game state to export', 'warning', 2000);
    }
    return exported;
  };

  const importGameState = (jsonString: string): boolean => {
    const success = gameStorage.importState(jsonString);
    if (success) {
      loadSavedState();
      showToast('Game state imported successfully', 'success', 2000);
    } else {
      showToast('Failed to import game state', 'error', 3000);
    }
    return success;
  };

  const getStorageInfo = () => {
    return gameStorage.getStorageInfo();
  };

  const contextValue: GameContextType = {
    state,
    dispatch,
    addPlayer,
    updateScore,
    startNewRound,
    resetGame,
    loadSavedState,
    clearSavedState,
    exportGameState,
    importGameState,
    getStorageInfo,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}