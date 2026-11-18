'use client';

import React from 'react';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';

interface EliminationStatusProps {
  players: Player[];
  className?: string;
}

export function EliminationStatus({ players, className }: EliminationStatusProps) {
  const eliminatedPlayers = players.filter(p => p.isEliminated);
  const activePlayers = players.filter(p => !p.isEliminated);
  
  if (players.length === 0) {
    return null;
  }

  return (
    <div className={cn('card p-4', className)}>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Game Status
      </h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Players
            </span>
            <span className="text-sm font-bold text-success">
              {activePlayers.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${(activePlayers.length / players.length) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Eliminated Players
            </span>
            <span className="text-sm font-bold text-danger">
              {eliminatedPlayers.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-danger transition-all duration-300"
              style={{ width: `${(eliminatedPlayers.length / players.length) * 100}%` }}
            />
          </div>
        </div>

        {eliminatedPlayers.length > 0 && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Eliminated Players
            </h4>
            <div className="space-y-2">
              {eliminatedPlayers.map((player) => (
                <div 
                  key={player.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {player.name}
                  </span>
                  <span className="font-medium text-danger">
                    {player.totalScore} points
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}