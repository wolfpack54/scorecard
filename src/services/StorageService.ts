import { GameState } from '@/types/game';
import { validationService } from './ValidationService';

const STORAGE_KEY = 'rummy-scorecard-game-state';
const STORAGE_VERSION = '1.0';

export interface StorageService {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
  isAvailable(): boolean;
}

class LocalStorageService implements StorageService {
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error: any) {
      console.warn('Failed to save to localStorage:', error.message);
      
      // Check for quota exceeded error
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn('Local storage quota exceeded. Attempting to clear old data...');
        
        try {
          // Try to clear some space
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key !== STORAGE_KEY && key.startsWith('rummy-scorecard-')) {
              keysToRemove.push(key);
            }
          }
          
          // Remove oldest items if needed
          if (keysToRemove.length > 0) {
            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log(`Cleared ${keysToRemove.length} old items from storage`);
            
            // Try again
            localStorage.setItem(key, value);
          } else {
            throw new Error('Unable to free storage space');
          }
        } catch (retryError) {
          console.error('Failed to recover from storage quota error:', retryError);
        }
      }
    }
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error: any) {
      console.warn('Failed to read from localStorage:', error.message);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error: any) {
      console.warn('Failed to remove from localStorage:', error.message);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error: any) {
      console.warn('Failed to clear localStorage:', error.message);
    }
  }

  isAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  getStorageInfo(): { used: number; quota: number; percentage: number } | null {
    try {
      // Estimate storage usage
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          total += key.length + (value ? value.length : 0);
        }
      }
      
      // Convert to KB
      const usedKB = total / 1024;
      // Typical localStorage quota is 5-10MB
      const quotaKB = 5 * 1024; // 5MB
      const percentage = (usedKB / quotaKB) * 100;
      
      return { used: usedKB, quota: quotaKB, percentage };
    } catch (error) {
      return null;
    }
  }
}

export class GameStorageService {
  private storage: StorageService;

  constructor(storage: StorageService = new LocalStorageService()) {
    this.storage = storage;
  }

  saveState(gameState: GameState): void {
    try {
      if (!this.storage.isAvailable()) {
        console.warn('Local storage is not available. Game state will not be saved.');
        return;
      }

      // Validate game state before saving
      const validation = validationService.validateGameState(gameState);
      if (!validation.isValid) {
        console.error('Invalid game state, not saving:', validation.message);
        return;
      }

      const serializedState = JSON.stringify({
        version: STORAGE_VERSION,
        savedAt: new Date().toISOString(),
        data: {
          ...gameState,
          players: gameState.players.map(player => ({
            ...player,
            createdAt: player.createdAt.toISOString(),
            updatedAt: player.updatedAt.toISOString(),
          })),
          rounds: gameState.rounds.map(round => ({
            ...round,
            createdAt: round.createdAt.toISOString(),
            completedAt: round.completedAt?.toISOString(),
            scores: round.scores.map(score => ({
              ...score,
              recordedAt: score.recordedAt.toISOString(),
            })),
          })),
          lastUpdated: gameState.lastUpdated.toISOString(),
        },
      });

      this.storage.setItem(STORAGE_KEY, serializedState);
      console.log('Game state saved successfully');
    } catch (error: any) {
      console.error('Failed to save game state:', error.message);
      
      // Check storage info if save failed
      const storageInfo = this.getStorageInfo();
      if (storageInfo && storageInfo.percentage > 90) {
        console.warn(`Storage is ${storageInfo.percentage.toFixed(1)}% full (${storageInfo.used.toFixed(1)}KB/${storageInfo.quota.toFixed(1)}KB)`);
      }
    }
  }

  loadState(): GameState | null {
    try {
      if (!this.storage.isAvailable()) {
        console.warn('Local storage is not available. Cannot load saved state.');
        return null;
      }

      const serializedState = this.storage.getItem(STORAGE_KEY);
      if (!serializedState) {
        console.log('No saved game state found');
        return null;
      }

      const parsedState = JSON.parse(serializedState);
      
      // Check version
      if (parsedState.version !== STORAGE_VERSION) {
        console.warn(`Saved state version mismatch: ${parsedState.version} (expected: ${STORAGE_VERSION}). Attempting to load anyway.`);
      }

      const gameState = parsedState.data;

      // Validate loaded state
      const validation = validationService.validateGameState(gameState);
      if (!validation.isValid) {
        console.error('Loaded game state is invalid:', validation.message);
        this.clearState(); // Clear corrupted state
        return null;
      }

      // Convert dates
      const state: GameState = {
        ...gameState,
        players: gameState.players.map((player: any) => ({
          ...player,
          createdAt: new Date(player.createdAt),
          updatedAt: new Date(player.updatedAt),
        })),
        rounds: gameState.rounds.map((round: any) => ({
          ...round,
          createdAt: new Date(round.createdAt),
          completedAt: round.completedAt ? new Date(round.completedAt) : undefined,
          scores: round.scores.map((score: any) => ({
            ...score,
            recordedAt: new Date(score.recordedAt),
          })),
        })),
        lastUpdated: new Date(gameState.lastUpdated),
      };

      console.log('Game state loaded successfully');
      return state;
    } catch (error: any) {
      console.error('Failed to load game state:', error.message);
      
      // If state is corrupted, clear it
      if (error instanceof SyntaxError) {
        console.warn('Corrupted game state detected. Clearing saved state.');
        this.clearState();
      }
      
      return null;
    }
  }

  clearState(): void {
    this.storage.removeItem(STORAGE_KEY);
    console.log('Game state cleared');
  }

  isAvailable(): boolean {
    return this.storage.isAvailable();
  }

  getStorageInfo(): { used: number; quota: number; percentage: number } | null {
    if (this.storage instanceof LocalStorageService) {
      return this.storage.getStorageInfo();
    }
    return null;
  }

  // Backup and restore functionality
  exportState(): string | null {
    try {
      const serializedState = this.storage.getItem(STORAGE_KEY);
      if (!serializedState) return null;
      
      const parsed = JSON.parse(serializedState);
      return JSON.stringify(parsed, null, 2); // Pretty print
    } catch (error) {
      console.error('Failed to export game state:', error);
      return null;
    }
  }

  importState(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Basic validation
      if (!parsed.version || !parsed.data) {
        throw new Error('Invalid backup format');
      }
      
      // Save the imported state
      this.storage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      console.log('Game state imported successfully');
      return true;
    } catch (error: any) {
      console.error('Failed to import game state:', error.message);
      return false;
    }
  }
}

export const gameStorage = new GameStorageService();