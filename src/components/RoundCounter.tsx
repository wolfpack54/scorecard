'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';

export function RoundCounter() {
  const { state } = useGame();

  const completedRounds = state.rounds.filter(r => r.isComplete).length;
  const currentRound = state.rounds.find(r => r.id === state.currentRound);
  const scoresThisRound = currentRound?.scores.length || 0;

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {state.currentRound}
            </div>
            <div className="text-xs text-white/80 mt-1">
              Round
            </div>
          </div>
        </div>
        
        {/* Progress ring */}
        <svg className="absolute inset-0 w-20 h-20" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * scoresThisRound) / Math.max(state.players.length, 1)}
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* Completed rounds badge */}
        <div className="absolute -top-2 -right-2">
          <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center shadow-md">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">
                {completedRounds}
              </div>
              <div className="text-[10px] text-gray-900">
                Done
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}