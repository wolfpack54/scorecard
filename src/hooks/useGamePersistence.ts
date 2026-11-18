'use client';

import { useEffect, useCallback, useRef } from 'react';
import { GameState } from '@/types/game';
import { gameStorage } from '@/services/StorageService';
import { useToast } from '@/components/ToastNotification';

interface UseGamePersistenceOptions {
  autoSave?: boolean;
  saveInterval?: number;
  onSave?: (state: GameState) => void;
  onLoad?: (state: GameState | null) => void;
}

export function useGamePersistence(
  gameState: GameState,
  options: UseGamePersistenceOptions = {}
) {
  const {
    autoSave = true,
    saveInterval = 1000,
    onSave,
    onLoad,
  } = options;

  const { showToast } = useToast();
  const lastSavedRef = useRef<string>('');
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a simple hash of the game state for change detection
  const getStateHash = useCallback((state: GameState): string => {
    return JSON.stringify({
      players: state.players.map(p => ({ id: p.id, score: p.totalScore, eliminated: p.isEliminated })),
      currentRound: state.currentRound,
      lastUpdated: state.lastUpdated.getTime(),
    });
  }, []);

  // Save game state
  const saveState = useCallback(() => {
    try {
      const currentHash = getStateHash(gameState);
      
      // Only save if state has changed
      if (currentHash !== lastSavedRef.current) {
        gameStorage.saveState(gameState);
        lastSavedRef.current = currentHash;
        
        if (onSave) {
          onSave(gameState);
        }
        
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Failed to save game state:', error.message);
      showToast('Failed to save game state', 'error', 3000);
      return false;
    }
  }, [gameState, getStateHash, onSave, showToast]);

  // Load game state
  const loadState = useCallback((): GameState | null => {
    try {
      const savedState = gameStorage.loadState();
      
      if (savedState) {
        if (onLoad) {
          onLoad(savedState);
        }
        
        showToast('Game state loaded successfully', 'success', 2000);
        return savedState;
      } else {
        showToast('No saved game state found', 'info', 2000);
        return null;
      }
    } catch (error: any) {
      console.error('Failed to load game state:', error.message);
      showToast('Failed to load game state', 'error', 3000);
      return null;
    }
  }, [onLoad, showToast]);

  // Clear saved state
  const clearState = useCallback(() => {
    try {
      gameStorage.clearState();
      lastSavedRef.current = '';
      showToast('Game state cleared', 'info', 2000);
      return true;
    } catch (error: any) {
      console.error('Failed to clear game state:', error.message);
      showToast('Failed to clear game state', 'error', 3000);
      return false;
    }
  }, [showToast]);

  // Export game state as JSON
  const exportState = useCallback(() => {
    try {
      const exported = gameStorage.exportState();
      if (exported) {
        showToast('Game state exported successfully', 'success', 2000);
        return exported;
      } else {
        showToast('No game state to export', 'warning', 2000);
        return null;
      }
    } catch (error: any) {
      console.error('Failed to export game state:', error.message);
      showToast('Failed to export game state', 'error', 3000);
      return null;
    }
  }, [showToast]);

  // Import game state from JSON
  const importState = useCallback((jsonString: string) => {
    try {
      const success = gameStorage.importState(jsonString);
      if (success) {
        showToast('Game state imported successfully', 'success', 2000);
        return true;
      } else {
        showToast('Failed to import game state', 'error', 3000);
        return false;
      }
    } catch (error: any) {
      console.error('Failed to import game state:', error.message);
      showToast('Failed to import game state', 'error', 3000);
      return false;
    }
  }, [showToast]);

  // Get storage info
  const getStorageInfo = useCallback(() => {
    return gameStorage.getStorageInfo();
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave) return;

    // Clear any existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Set up new timer
    saveTimerRef.current = setTimeout(() => {
      saveState();
    }, saveInterval);

    // Cleanup
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [gameState, autoSave, saveInterval, saveState]);

  // Initial load on mount
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      lastSavedRef.current = getStateHash(savedState);
    }
  }, [loadState, getStateHash]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (autoSave) {
        saveState();
      }
    };
  }, [autoSave, saveState]);

  return {
    saveState,
    loadState,
    clearState,
    exportState,
    importState,
    getStorageInfo,
    isStorageAvailable: gameStorage.isAvailable(),
  };
}