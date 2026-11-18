'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';

export function RoundDisplay() {
  const { state } = useGame();
  
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Current Round
        </div>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {state.currentRound}
            </span>
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">
                {state.rounds.filter(r => r.isComplete).length}
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {state.rounds.filter(r => r.isComplete).length} rounds completed
        </div>
      </div>
    </div>
  );
}