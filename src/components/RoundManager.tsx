'use client';

import React from 'react';
import { RoundCounter } from './RoundCounter';
import { RoundControls } from './RoundControls';

export function RoundManager() {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Round Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Manage game rounds and track progress through the game.
          </p>
          <RoundCounter />
        </div>
        
        <div className="md:w-2/3">
          <RoundControls />
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Round Rules
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Scores are recorded per round</li>
              <li>• Start new round when all players have scored</li>
              <li>• Previous round scores become read-only</li>
              <li>• Game ends when all players reach 201+ points</li>
              <li>• Maximum 7 players per game</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}