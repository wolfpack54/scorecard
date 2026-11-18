'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { ScoreInput } from './ScoreInput';
import { RoundDisplay } from './RoundDisplay';
import { Button } from './ui/Button';

export function ScoreEntry() {
  const { state, updateScore, startNewRound } = useGame();

  // Get active players (not eliminated)
  const activePlayers = state.players.filter(player => !player.isEliminated);
  
  const handleScoreSubmit = (playerId: string, score: number) => {
    updateScore(playerId, score);
  };

  const handleStartNewRound = () => {
    if (activePlayers.length === 0) {
      alert('No active players to start a new round');
      return;
    }

    const currentRound = state.rounds.find(r => r.id === state.currentRound);
    const hasScores = currentRound?.scores && currentRound.scores.length > 0;

    if (!hasScores && state.currentRound > 1) {
      if (!confirm('No scores entered in current round. Start new round anyway?')) {
        return;
      }
    }

    startNewRound();
  };

  if (state.players.length === 0) {
    return (
      <div className="card text-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Score Entry
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add players first to start entering scores
        </p>
      </div>
    );
  }

  const canStartNewRound = activePlayers.length > 0;

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Score Entry
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Enter scores for each active player in the current round.
          </p>
        </div>
        <RoundDisplay />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {activePlayers.map((player) => (
            <ScoreInput
              key={player.id}
              player={player}
              onSubmit={(score) => handleScoreSubmit(player.id, score)}
            />
          ))}
        </div>

        {activePlayers.length === 0 && (
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              All players have been eliminated. Game over!
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Active players: {activePlayers.length} / {state.players.length}</p>
          <p className="mt-1">
            Eliminated: {state.players.filter(p => p.isEliminated).length}
          </p>
        </div>
        
        <Button
          onClick={handleStartNewRound}
          disabled={!canStartNewRound}
          variant="secondary"
        >
          Start New Round
        </Button>
      </div>
    </div>
  );
}