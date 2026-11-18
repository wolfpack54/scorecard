'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from './ui/Button';

interface RoundControlsProps {
  onStartNewRound?: () => void;
  onResetGame?: () => void;
}

export function RoundControls({ 
  onStartNewRound, 
  onResetGame 
}: RoundControlsProps) {
  const { state, startNewRound, resetGame } = useGame();

  const activePlayers = state.players.filter(p => !p.isEliminated);
  const currentRound = state.rounds.find(r => r.id === state.currentRound);
  const hasScores = currentRound?.scores && currentRound.scores.length > 0;
  
  const handleStartNewRound = () => {
    if (onStartNewRound) {
      onStartNewRound();
    } else {
      startNewRound();
    }
  };

  const handleResetGame = () => {
    if (onResetGame) {
      onResetGame();
    } else {
      if (confirm('Are you sure you want to reset the game? All scores and players will be cleared.')) {
        resetGame();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Button
          onClick={handleStartNewRound}
          disabled={activePlayers.length === 0}
          variant="secondary"
          fullWidth
        >
          Start New Round
        </Button>
        
        <Button
          onClick={handleResetGame}
          variant="outline"
          fullWidth
        >
          Reset Game
        </Button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Active Players:</span>
          <span className="font-medium">{activePlayers.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Scores this round:</span>
          <span className="font-medium">{hasScores ? currentRound!.scores.length : 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Rounds:</span>
          <span className="font-medium">{state.rounds.filter(r => r.isComplete).length}</span>
        </div>
      </div>

      {activePlayers.length === 0 && state.players.length > 0 && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded">
          <p className="text-sm text-danger text-center">
            All players eliminated! Game over.
          </p>
        </div>
      )}
    </div>
  );
}