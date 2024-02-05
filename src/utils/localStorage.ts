import { GAME_STATE_KEY } from './constants';
import getDayNumber from './getDayNumber';

export function saveGameState({
  pastWords,
  score,
  word,
  deletionsRemaining,
}: {
  pastWords: string[];
  score: number;
  word: string;
  deletionsRemaining: number;
}) {
  const day = getDayNumber();
  localStorage.setItem(
    GAME_STATE_KEY,
    JSON.stringify({
      day,
      pastWords,
      score,
      word,
      deletionsRemaining,
    }),
  );
}

export function loadGameState() {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  const parsed = savedState ? JSON.parse(savedState) : undefined;
  if (!parsed) return;
  if (parsed?.day !== getDayNumber()) {
    localStorage.removeItem(GAME_STATE_KEY);
    return;
  }
  return parsed;
}
