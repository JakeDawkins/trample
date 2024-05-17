import { GAME_STATE_KEY, HARD_MODE_ENABLED_KEY } from './constants';
import getDayNumber from './getDayNumber';

export function saveHardModeEnabled(enabled: boolean) {
  localStorage.setItem(HARD_MODE_ENABLED_KEY, JSON.stringify(enabled));
}

export function loadHardModeEnabled() {
  const savedState = localStorage.getItem(HARD_MODE_ENABLED_KEY);
  return savedState ? JSON.parse(savedState) : false;
}

export function saveGameState({
  pastWords,
  score,
  word,
  deletionsRemaining,
  hardModeAttempts,
}: {
  pastWords: string[];
  score: number;
  word: string;
  deletionsRemaining: number;
  hardModeAttempts?: number;
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
      hardModeAttempts,
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
