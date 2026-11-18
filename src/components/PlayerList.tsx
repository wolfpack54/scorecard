'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';

interface PlayerListProps {
  players?: Player[];
}

export function PlayerList({ players: propPlayers }: PlayerListProps) {
  const { state } = useGame();
  const players = propPlayers || state.players;

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No players added yet</p>
        <p className="text-sm mt-1">Add players to start tracking scores</p>
      </div>
    );
  }

  // Sort players by score (descending) then by name (ascending)
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Players ({players.length})
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        {sortedPlayers.map((player) => (
          <div
            key={player.id}
            className={cn(
              'card p-4 transition-all duration-200',
              player.isEliminated
                ? 'bg-gray-100 dark:bg-gray-800 border-l-4 border-danger'
                : 'border-l-4 border-success'
            )}
          >
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {player.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {player.totalScore}
                  </span>
                  {player.totalScore >= 200 && (
                    <span className={cn(
                      'text-sm font-medium px-2 py-0.5 rounded',
                      player.totalScore >= 201
                        ? 'bg-danger text-white'
                        : 'bg-warning text-gray-900'
                    )}>
                      {player.totalScore >= 201 ? 'ELIMINATED' : 'NEAR LIMIT'}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {player.isEliminated ? (
                    <span className="text-danger font-medium">Eliminated</span>
                  ) : (
                    <span className="text-success font-medium">Active</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Updated: {player.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            
            {/* Progress bar showing progress toward elimination */}
            {!player.isEliminated && player.totalScore > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress to elimination</span>
                  <span>{player.totalScore} / 201</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      'h-full transition-all duration-300',
                      player.totalScore >= 180 ? 'bg-warning' : 'bg-primary'
                    )}
                    style={{ width: `${Math.min((player.totalScore / 201) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}