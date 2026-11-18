import { GameState, GameAction, CreatePlayerDTO, UpdatePlayerDTO } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

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

export function gameReducer(state: GameState, action: GameAction): GameState {
  const now = new Date();

  switch (action.type) {
    case 'ADD_PLAYER': {
      if (state.players.length >= state.settings.maxPlayers) {
        return state;
      }

      const newPlayer = {
        id: uuidv4(),
        name: action.payload.name.trim(),
        totalScore: 0,
        isEliminated: false,
        createdAt: now,
        updatedAt: now,
      };

      return {
        ...state,
        players: [...state.players, newPlayer],
        lastUpdated: now,
      };
    }

    case 'UPDATE_SCORE': {
      const { playerId, score } = action.payload;
      const playerIndex = state.players.findIndex(p => p.id === playerId);

      if (playerIndex === -1) {
        return state;
      }

      const player = state.players[playerIndex];
      
      // Don't update eliminated players
      if (player.isEliminated) {
        return state;
      }

      const newTotalScore = player.totalScore + score;
      const isEliminated = newTotalScore >= state.settings.eliminationThreshold;

      const updatedPlayer = {
        ...player,
        totalScore: newTotalScore,
        isEliminated,
        updatedAt: now,
      };

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = updatedPlayer;

      // Add to current round scores
      const currentRoundIndex = state.rounds.findIndex(r => r.id === state.currentRound);
      let updatedRounds = [...state.rounds];

      if (currentRoundIndex === -1) {
        // Create new round
        const newRound = {
          id: state.currentRound,
          scores: [{
            playerId,
            score,
            recordedAt: now,
          }],
          isComplete: false,
          createdAt: now,
        };
        updatedRounds.push(newRound);
      } else {
        // Add to existing round
        const updatedRound = {
          ...state.rounds[currentRoundIndex],
          scores: [
            ...state.rounds[currentRoundIndex].scores,
            {
              playerId,
              score,
              recordedAt: now,
            },
          ],
        };
        updatedRounds[currentRoundIndex] = updatedRound;
      }

      return {
        ...state,
        players: updatedPlayers,
        rounds: updatedRounds,
        lastUpdated: now,
      };
    }

    case 'START_NEW_ROUND': {
      // Complete current round if it exists
      const updatedRounds = state.rounds.map(round => 
        round.id === state.currentRound 
          ? { ...round, isComplete: true, completedAt: now }
          : round
      );

      const nextRoundNumber = state.currentRound + 1;

      // Create new round entry
      const newRound = {
        id: nextRoundNumber,
        scores: [],
        isComplete: false,
        createdAt: now,
      };

      return {
        ...state,
        currentRound: nextRoundNumber,
        rounds: [...updatedRounds, newRound],
        lastUpdated: now,
      };
    }

    case 'ELIMINATE_PLAYER': {
      const playerIndex = state.players.findIndex(p => p.id === action.payload);

      if (playerIndex === -1) {
        return state;
      }

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        isEliminated: true,
        updatedAt: now,
      };

      return {
        ...state,
        players: updatedPlayers,
        lastUpdated: now,
      };
    }

    case 'RESET_GAME': {
      const confirmed = window.confirm('Are you sure you want to reset the game? All players and scores will be cleared.');
      if (!confirmed) {
        return state;
      }
      
      return {
        ...INITIAL_STATE,
        lastUpdated: now,
      };
    }

    case 'CLEAR_STATE': {
      return INITIAL_STATE;
    }

    case 'LOAD_STATE': {
      return {
        ...action.payload,
        lastUpdated: now,
      };
    }

    default:
      return state;
  }
}