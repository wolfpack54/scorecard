import { GameState } from '@/types/game';

const STORAGE_KEY = 'rummy-scorecard-game-state';

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
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
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
}

export class GameStorageService {
  private storage: StorageService;

  constructor(storage: StorageService = new LocalStorageService()) {
    this.storage = storage;
  }

  saveState(gameState: GameState): void {
    try {
      const serializedState = JSON.stringify({
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
      });

      this.storage.setItem(STORAGE_KEY, serializedState);
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  loadState(): GameState | null {
    try {
      const serializedState = this.storage.getItem(STORAGE_KEY);
      if (!serializedState) {
        return null;
      }

      const parsedState = JSON.parse(serializedState);

      return {
        ...parsedState,
        players: parsedState.players.map((player: any) => ({
          ...player,
          createdAt: new Date(player.createdAt),
          updatedAt: new Date(player.updatedAt),
        })),
        rounds: parsedState.rounds.map((round: any) => ({
          ...round,
          createdAt: new Date(round.createdAt),
          completedAt: round.completedAt ? new Date(round.completedAt) : undefined,
          scores: round.scores.map((score: any) => ({
            ...score,
            recordedAt: new Date(score.recordedAt),
          })),
        })),
        lastUpdated: new Date(parsedState.lastUpdated),
      };
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  clearState(): void {
    this.storage.removeItem(STORAGE_KEY);
  }

  isAvailable(): boolean {
    return this.storage.isAvailable();
  }
}

export const gameStorage = new GameStorageService();