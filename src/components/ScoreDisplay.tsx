'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { PlayerScoreCard } from './PlayerScoreCard';
import { EliminationStatus } from './EliminationStatus';

export function ScoreDisplay() {
  const { state } = useGame();

  // Sort players by score (descending) then by name (ascending)
  const sortedPlayers = [...state.players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return a.name.localeCompare(b.name);
  });

  if (state.players.length === 0) {
    return (
      <div className="card text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Score Display
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add players to see their scores here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Live Scores
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time updates of all player scores
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Players
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {state.players.length}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sortedPlayers.map((player, index) => (
            <PlayerScoreCard
              key={player.id}
              player={player}
              rank={index + 1}
            />
          ))}
        </div>
      </div>

      <EliminationStatus players={state.players} />
    </div>
  );
}