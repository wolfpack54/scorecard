import { GameState, Player, Round, RoundScore } from '@/types/game';

export interface SerializedGameState {
  version: string;
  savedAt: string;
  data: {
    players: Array<{
      id: string;
      name: string;
      totalScore: number;
      isEliminated: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    currentRound: number;
    rounds: Array<{
      id: number;
      scores: Array<{
        playerId: string;
        score: number;
        recordedAt: string;
      }>;
      isComplete: boolean;
      createdAt: string;
      completedAt?: string;
    }>;
    settings: {
      maxPlayers: number;
      eliminationThreshold: number;
      maxScorePerEntry: number;
      playerNameMaxLength: number;
    };
    lastUpdated: string;
  };
}

export function serializeGameState(gameState: GameState): SerializedGameState {
  return {
    version: '1.0',
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
  };
}

export function deserializeGameState(serialized: SerializedGameState): GameState {
  const { data } = serialized;
  
  return {
    ...data,
    players: data.players.map(player => ({
      ...player,
      createdAt: new Date(player.createdAt),
      updatedAt: new Date(player.updatedAt),
    })),
    rounds: data.rounds.map(round => ({
      ...round,
      createdAt: new Date(round.createdAt),
      completedAt: round.completedAt ? new Date(round.completedAt) : undefined,
      scores: round.scores.map(score => ({
        ...score,
        recordedAt: new Date(score.recordedAt),
      })),
    })),
    lastUpdated: new Date(data.lastUpdated),
  };
}

export function validateSerializedState(serialized: any): boolean {
  try {
    // Check required fields
    if (!serialized || typeof serialized !== 'object') return false;
    if (!serialized.version || typeof serialized.version !== 'string') return false;
    if (!serialized.data || typeof serialized.data !== 'object') return false;
    
    const { data } = serialized;
    
    // Check players
    if (!Array.isArray(data.players)) return false;
    for (const player of data.players) {
      if (!player.id || !player.name || typeof player.totalScore !== 'number' || 
          typeof player.isEliminated !== 'boolean' || !player.createdAt || !player.updatedAt) {
        return false;
      }
    }
    
    // Check rounds
    if (!Array.isArray(data.rounds)) return false;
    for (const round of data.rounds) {
      if (typeof round.id !== 'number' || !Array.isArray(round.scores) || 
          typeof round.isComplete !== 'boolean' || !round.createdAt) {
        return false;
      }
      
      for (const score of round.scores) {
        if (!score.playerId || typeof score.score !== 'number' || !score.recordedAt) {
          return false;
        }
      }
    }
    
    // Check settings
    if (!data.settings || typeof data.settings !== 'object') return false;
    if (typeof data.settings.maxPlayers !== 'number' || 
        typeof data.settings.eliminationThreshold !== 'number' ||
        typeof data.settings.maxScorePerEntry !== 'number' ||
        typeof data.settings.playerNameMaxLength !== 'number') {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export function createBackupData(gameState: GameState): { data: string; timestamp: string; playerCount: number } {
  const serialized = serializeGameState(gameState);
  const jsonString = JSON.stringify(serialized, null, 2);
  
  return {
    data: jsonString,
    timestamp: new Date().toISOString(),
    playerCount: gameState.players.length,
  };
}

export function restoreFromBackup(backupString: string): GameState | null {
  try {
    const parsed = JSON.parse(backupString);
    
    if (!validateSerializedState(parsed)) {
      throw new Error('Invalid backup format');
    }
    
    return deserializeGameState(parsed);
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return null;
  }
}

// Helper function to format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Helper function to calculate storage size
export function estimateStorageSize(gameState: GameState): number {
  const serialized = serializeGameState(gameState);
  const jsonString = JSON.stringify(serialized);
  return new Blob([jsonString]).size;
}