'use client';

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { validatePlayerName } from '@/schemas/game';

export function PlayerForm() {
  const { state, addPlayer } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate player name
    const validation = validatePlayerName(playerName);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    // Check player limit
    if (state.players.length >= state.settings.maxPlayers) {
      setError(`Maximum ${state.settings.maxPlayers} players allowed`);
      return;
    }

    // Check for duplicate names
    const normalizedNewName = playerName.trim().toLowerCase();
    const hasDuplicate = state.players.some(
      player => player.name.toLowerCase() === normalizedNewName
    );

    if (hasDuplicate) {
      setError('Player name already exists');
      return;
    }

    // Add player
    addPlayer(playerName.trim());
    setPlayerName('');
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlayerName(value);

    // Clear error when user starts typing
    if (error && value.trim()) {
      setError(null);
    }
  };

  const canAddPlayer = state.players.length < state.settings.maxPlayers;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          label="Add Player"
          placeholder="Enter player name"
          value={playerName}
          onChange={handleChange}
          error={error || undefined}
          disabled={!canAddPlayer}
          maxLength={state.settings.playerNameMaxLength}
        />
        <div className="flex items-end">
          <Button
            type="submit"
            disabled={!playerName.trim() || !canAddPlayer}
            className="whitespace-nowrap"
          >
            Add Player
          </Button>
        </div>
      </div>
      
      {!canAddPlayer && (
        <p className="text-sm text-warning">
          Maximum {state.settings.maxPlayers} players reached
        </p>
      )}
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Players added: {state.players.length} / {state.settings.maxPlayers}</p>
      </div>
    </form>
  );
}