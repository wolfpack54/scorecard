import { GameState, CreatePlayerDTO, UpdatePlayerDTO, Player } from '@/types/game';
import { gameStorage } from './StorageService';

export interface GameStateService {
  // Player operations
  addPlayer(state: GameState, playerData: CreatePlayerDTO): GameState;
  getPlayers(state: GameState): Player[];
  updatePlayerScore(state: GameState, playerUpdate: UpdatePlayerDTO): GameState;
  
  // Round operations
  startNewRound(state: GameState): GameState;
  getCurrentRound(state: GameState): number;
  
  // State persistence
  saveState(state: GameState): void;
  loadState(): GameState | null;
  clearState(): void;
}

export class GameService implements GameStateService {
  addPlayer(state: GameState, playerData: CreatePlayerDTO): GameState {
    // Validation: Check player limit
    if (state.players.length >= state.settings.maxPlayers) {
      return state;
    }

    // Validation: Check name is not empty
    if (!playerData.name.trim()) {
      return state;
    }

    // Check for duplicate names (case-insensitive)
    const normalizedNewName = playerData.name.trim().toLowerCase();
    const hasDuplicate = state.players.some(
      player => player.name.toLowerCase() === normalizedNewName
    );

    if (hasDuplicate) {
      return state;
    }

    // Implementation would be in the reducer
    // This is just a service layer wrapper
    return {
      ...state,
      // The actual player creation would be handled by the reducer
    };
  }

  getPlayers(state: GameState): Player[] {
    return [...state.players].sort((a, b) => {
      // Sort by score descending, then by name ascending
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return a.name.localeCompare(b.name);
    });
  }

  updatePlayerScore(state: GameState, playerUpdate: UpdatePlayerDTO): GameState {
    const player = state.players.find(p => p.id === playerUpdate.playerId);
    
    if (!player) {
      return state;
    }

    // Don't update eliminated players
    if (player.isEliminated) {
      return state;
    }

    // Check if score would eliminate player
    const newScore = player.totalScore + playerUpdate.score;
    const wouldEliminate = newScore >= state.settings.eliminationThreshold;

    // Implementation would be in the reducer
    // This is just a service layer wrapper
    return {
      ...state,
      // The actual score update would be handled by the reducer
    };
  }

  startNewRound(state: GameState): GameState {
    // Check if there are active players
    const activePlayers = state.players.filter(p => !p.isEliminated);
    if (activePlayers.length === 0) {
      return state;
    }

    // Implementation would be in the reducer
    return {
      ...state,
      // Round progression handled by reducer
    };
  }

  getCurrentRound(state: GameState): number {
    return state.currentRound;
  }

  saveState(state: GameState): void {
    gameStorage.saveState(state);
  }

  loadState(): GameState | null {
    return gameStorage.loadState();
  }

  clearState(): void {
    gameStorage.clearState();
  }

  // Helper methods
  getActivePlayers(state: GameState): Player[] {
    return state.players.filter(player => !player.isEliminated);
  }

  getEliminatedPlayers(state: GameState): Player[] {
    return state.players.filter(player => player.isEliminated);
  }

  canAddPlayer(state: GameState): boolean {
    return state.players.length < state.settings.maxPlayers;
  }

  isGameOver(state: GameState): boolean {
    const activePlayers = this.getActivePlayers(state);
    return activePlayers.length === 0;
  }
}

export const gameService = new GameService();