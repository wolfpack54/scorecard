import { z } from 'zod';

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  name: z.string()
    .min(1, 'Player name is required')
    .max(30, 'Player name must be 30 characters or less'),
  totalScore: z.number().int().min(0),
  isEliminated: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const RoundScoreSchema = z.object({
  playerId: z.string().uuid(),
  score: z.number()
    .int('Score must be an integer')
    .min(0, 'Score cannot be negative')
    .max(100, 'Score per round cannot exceed 100'),
  recordedAt: z.date(),
});

export const RoundSchema = z.object({
  id: z.number().int().min(1),
  scores: z.array(RoundScoreSchema),
  isComplete: z.boolean(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
});

export const GameSettingsSchema = z.object({
  maxPlayers: z.literal(7),
  eliminationThreshold: z.literal(201),
  maxScorePerEntry: z.number().int().min(1).max(100),
  playerNameMaxLength: z.number().int().min(1).max(50),
});

export const GameStateSchema = z.object({
  players: z.array(PlayerSchema).max(7),
  currentRound: z.number().int().min(1),
  rounds: z.array(RoundSchema),
  settings: GameSettingsSchema,
  lastUpdated: z.date(),
});

export const CreatePlayerDTOSchema = z.object({
  name: z.string()
    .min(1, 'Player name is required')
    .max(30, 'Player name must be 30 characters or less'),
});

export const UpdatePlayerDTOSchema = z.object({
  playerId: z.string().uuid(),
  score: z.number()
    .int('Score must be an integer')
    .min(0, 'Score cannot be negative')
    .max(100, 'Score per round cannot exceed 100'),
});

// Helper functions for schema validation
export function validatePlayerName(name: string): z.SafeParseReturnType<string, string> {
  return CreatePlayerDTOSchema.shape.name.safeParse(name);
}

export function validateScore(score: number | string): z.SafeParseReturnType<number, number> {
  const numScore = typeof score === 'string' ? parseInt(score, 10) : score;
  return UpdatePlayerDTOSchema.shape.score.safeParse(numScore);
}

export function isPlayerEliminated(score: number): boolean {
  return score >= 201;
}