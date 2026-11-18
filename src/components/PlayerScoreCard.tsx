'use client';

import React from 'react';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';

interface PlayerScoreCardProps {
  player: Player;
  rank: number;
  showElimination?: boolean;
}

export function PlayerScoreCard({ player, rank, showElimination = true }: PlayerScoreCardProps) {
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500 text-gray-900';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-amber-700 text-white';
      default: return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (player: Player) => {
    if (player.isEliminated) return 'bg-danger text-white';
    if (player.totalScore >= 180) return 'bg-warning text-gray-900';
    return 'bg-success text-white';
  };

  const statusText = player.isEliminated 
    ? 'ELIMINATED' 
    : player.totalScore >= 180 
      ? 'NEAR LIMIT' 
      : 'ACTIVE';

  return (
    <div className={cn(
      'card p-4 transition-all duration-200 hover:shadow-card-lg',
      player.isEliminated && 'opacity-75'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
            getRankBadgeColor(rank)
          )}>
            {rank}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {player.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {player.totalScore}
              </span>
              {showElimination && (
                <span className={cn(
                  'text-xs font-medium px-2 py-1 rounded',
                  getStatusColor(player)
                )}>
                  {statusText}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Score
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {player.updatedAt.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {!player.isEliminated && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress to elimination (201)</span>
            <span>{player.totalScore} / 201</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-500',
                player.totalScore >= 180 ? 'bg-warning' : 'bg-primary'
              )}
              style={{ width: `${Math.min((player.totalScore / 201) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span className="font-bold">201</span>
          </div>
        </div>
      )}

      {player.isEliminated && (
        <div className="mt-3 p-2 bg-danger/10 border border-danger/20 rounded">
          <p className="text-xs text-danger text-center">
            Player eliminated at {player.totalScore} points
          </p>
        </div>
      )}
    </div>
  );
}