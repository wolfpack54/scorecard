'use client';

import React, { useState } from 'react';
import { Player } from '@/types/game';
import { Input } from './ui/Input';
import { validateScore } from '@/schemas/game';

interface ScoreInputProps {
  player: Player;
  onSubmit: (score: number) => void;
  disabled?: boolean;
}

export function ScoreInput({ player, onSubmit, disabled }: ScoreInputProps) {
  const [score, setScore] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateScore(score);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    const numericScore = parseInt(score, 10);
    
    // Check if score would eliminate player
    const newTotal = player.totalScore + numericScore;
    if (newTotal >= 201 && !player.isEliminated) {
      // Ask for confirmation if score would eliminate player
      if (!confirm(`Adding ${numericScore} points would eliminate ${player.name} (${newTotal} total). Continue?`)) {
        return;
      }
    }

    onSubmit(numericScore);
    setScore('');
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setScore(value);
      
      // Clear error when user starts typing
      if (error && value) {
        setError(null);
      }
    }
  };

  if (player.isEliminated) {
    return (
      <div className="opacity-50">
        <Input
          label={player.name}
          value="ELIMINATED"
          disabled
          className="bg-gray-100 dark:bg-gray-800"
        />
        <p className="text-xs text-danger mt-1">
          This player has been eliminated (Score: {player.totalScore})
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <div className="flex gap-2">
        <Input
          label={player.name}
          placeholder="Enter score"
          value={score}
          onChange={handleChange}
          error={error || undefined}
          disabled={disabled}
          className="flex-1"
          maxLength={3}
          inputMode="numeric"
        />
        <div className="flex items-end">
          <button
            type="submit"
            disabled={!score.trim() || disabled}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>Current: {player.totalScore}</span>
        <span>New total: {player.totalScore + (parseInt(score) || 0)}</span>
      </div>
    </form>
  );
}