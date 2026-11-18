'use client';

import React from 'react';
import { PlayerForm } from './PlayerForm';
import { PlayerList } from './PlayerList';

export function PlayerManagement() {
  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Player Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add up to 7 players to track their scores in the Rummy game.
        </p>
      </div>
      
      <PlayerForm />
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <PlayerList />
      </div>
    </div>
  );
}