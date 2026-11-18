'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';

export function Footer() {
  const { clearSavedState, loadSavedState } = useGame();

  const handleClearData = () => {
    if (confirm('Clear all saved game data? This cannot be undone.')) {
      clearSavedState();
    }
  };

  const handleLoadData = () => {
    if (confirm('Load saved game data? Current game will be replaced.')) {
      loadSavedState();
    }
  };

  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg">Rummy Scorecard</h3>
            <p className="text-gray-400 text-sm mt-1">
              A simple score tracking application for Rummy card game
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLoadData}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Load Saved Game
            </button>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-danger hover:bg-danger-light rounded-lg text-sm transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <div className="text-gray-400 text-sm space-y-1">
            <p>Game Rules: Max 7 players • 200 points max • 201 points = Elimination</p>
            <p>Data is automatically saved in your browser&apos;s local storage</p>
            <p className="mt-2">
              Built with Next.js & Tailwind CSS • Deployable on Vercel
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}