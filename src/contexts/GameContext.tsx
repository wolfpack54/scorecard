'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
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

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Load saved state on initial mount
  useEffect(() => {
    const savedState = gameStorage.loadState();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  }, []);

  // Save state on changes
  useEffect(() => {
    if (state !== INITIAL_STATE) {
      gameStorage.saveState(state);
    }
  }, [state]);

  const addPlayer = (name: string) => {
    const playerData: CreatePlayerDTO = { name };
    dispatch({ type: 'ADD_PLAYER', payload: playerData });
  };

  const updateScore = (playerId: string, score: number) => {
    const playerUpdate: UpdatePlayerDTO = { playerId, score };
    dispatch({ type: 'UPDATE_SCORE', payload: playerUpdate });
  };

  const startNewRound = () => {
    dispatch({ type: 'START_NEW_ROUND' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const loadSavedState = () => {
    const savedState = gameStorage.loadState();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  };

  const clearSavedState = () => {
    gameStorage.clearState();
    dispatch({ type: 'CLEAR_STATE' });
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