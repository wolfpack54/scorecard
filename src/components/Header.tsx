'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';

export function Header() {
  const { state } = useGame();

  const activePlayers = state.players.filter(p => !p.isEliminated);
  const eliminatedPlayers = state.players.filter(p => p.isEliminated);
  const totalScore = state.players.reduce((sum, player) => sum + player.totalScore, 0);

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Rummy Scorecard</h1>
            <p className="text-white/80 mt-1">
              Track scores for up to 7 players • 201 points = Elimination
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold">{state.players.length}</div>
              <div className="text-sm text-white/80">Players</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold text-success-light">{activePlayers.length}</div>
              <div className="text-sm text-white/80">Active</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold text-danger-light">{eliminatedPlayers.length}</div>
              <div className="text-sm text-white/80">Eliminated</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold">{totalScore}</div>
              <div className="text-sm text-white/80">Total Points</div>
            </div>
          </div>
        </div>

        {/* Game status indicator */}
        {state.players.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${activePlayers.length > 0 ? 'bg-success animate-pulse' : 'bg-danger'}`} />
                <span>
                  {activePlayers.length > 0 
                    ? `Game in progress • Round ${state.currentRound}` 
                    : 'Game over! All players eliminated'}
                </span>
              </div>
              <div className="text-white/70">
                Last updated: {state.lastUpdated.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}