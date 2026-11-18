import { ValidationResult } from '@/types/game';
import { validatePlayerName, validateScore as validateScoreSchema, isPlayerEliminated as checkPlayerEliminated } from '@/schemas/game';

export class ValidationService {
  validatePlayerName(name: string): ValidationResult {
    const validation = validatePlayerName(name);
    
    if (!validation.success) {
      return {
        isValid: false,
        message: validation.error.errors[0].message,
      };
    }

    return { isValid: true };
  }

  validateScore(score: number | string): ValidationResult {
    const validation = validateScoreSchema(score);
    
    if (!validation.success) {
      return {
        isValid: false,
        message: validation.error.errors[0].message,
      };
    }

    const numScore = typeof score === 'string' ? parseInt(score, 10) : score;
    
    if (numScore < 0) {
      return {
        isValid: false,
        message: 'Score cannot be negative',
      };
    }

    if (numScore > 100) {
      return {
        isValid: false,
        message: 'Score per round cannot exceed 100',
      };
    }

    return { isValid: true };
  }

  isPlayerEliminated(score: number): boolean {
    return checkPlayerEliminated(score);
  }

  validatePlayerLimit(currentPlayers: number, maxPlayers: number): ValidationResult {
    if (currentPlayers >= maxPlayers) {
      return {
        isValid: false,
        message: `Maximum ${maxPlayers} players allowed`,
      };
    }

    return { isValid: true };
  }

  validateDuplicatePlayerName(players: Array<{ name: string }>, newName: string): ValidationResult {
    const normalizedNewName = newName.trim().toLowerCase();
    const hasDuplicate = players.some(
      player => player.name.toLowerCase() === normalizedNewName
    );

    if (hasDuplicate) {
      return {
        isValid: false,
        message: 'Player name already exists',
      };
    }

    return { isValid: true };
  }

  validateGameState(state: any): ValidationResult {
    // Basic validation of game state structure
    if (!state || typeof state !== 'object') {
      return {
        isValid: false,
        message: 'Invalid game state',
      };
    }

    if (!Array.isArray(state.players)) {
      return {
        isValid: false,
        message: 'Players must be an array',
      };
    }

    if (typeof state.currentRound !== 'number' || state.currentRound < 1) {
      return {
        isValid: false,
        message: 'Invalid current round',
      };
    }

    if (!state.settings || typeof state.settings !== 'object') {
      return {
        isValid: false,
        message: 'Invalid game settings',
      };
    }

    return { isValid: true };
  }

  validateScoreForEliminatedPlayer(playerIsEliminated: boolean, newScore: number, currentScore: number): ValidationResult {
    if (playerIsEliminated) {
      return {
        isValid: false,
        message: 'This player is eliminated and cannot receive scores',
      };
    }

    const wouldEliminate = (currentScore + newScore) >= 201;
    if (wouldEliminate) {
      // This is a warning, not an error - user should confirm
      return {
        isValid: true,
        message: `Adding ${newScore} points would eliminate this player (${currentScore + newScore} total)`,
      };
    }

    return { isValid: true };
  }
}

export const validationService = new ValidationService();