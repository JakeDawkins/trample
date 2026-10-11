import type { Context } from 'hono';
import { z } from 'zod';

// Env types from npm run cf-typegen
export type AppContext = Context<{ Bindings: Env }>;

export const Game = z.object({
  startingWord: z.string().uppercase().openapi({ example: 'BAT' }),
  date: z.iso.date(),
});

export const GameResult = z.object({
  date: z.iso.date(),
  score: z.int(),
  moves: z.int(),
  longestWord: z.int(),
});
