export interface Player {
  id: string;
  name: string;
  totalScore: number;
  isEliminated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoundScore {
  playerId: string;
  score: number;
  recordedAt: Date;
}

export interface Round {
  id: number;
  scores: RoundScore[];
  isComplete: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface GameSettings {
  maxPlayers: number;
  eliminationThreshold: number;
  maxScorePerEntry: number;
  playerNameMaxLength: number;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  rounds: Round[];
  settings: GameSettings;
  lastUpdated: Date;
}

export interface CreatePlayerDTO {
  name: string;
}

export interface UpdatePlayerDTO {
  playerId: string;
  score: number;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export type GameAction =
  | { type: 'ADD_PLAYER'; payload: CreatePlayerDTO }
  | { type: 'UPDATE_SCORE'; payload: UpdatePlayerDTO }
  | { type: 'START_NEW_ROUND' }
  | { type: 'RESET_GAME' }
  | { type: 'ELIMINATE_PLAYER'; payload: string }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'CLEAR_STATE' };