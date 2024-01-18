import getDayNumber from './getDayNumber';
import mixpanel from 'mixpanel-browser'
interface Stats {
  dayNumber?: number;
  score?: number;
  bestScore?: number;
  longestWord?: number;
  numWords?: number;
}

interface endGameOpts {
  score: number;
  longestWord?: number;
  pastWords?: string[];
}

// Save stats about today's game
export function endGame({
  score,
  longestWord,
  pastWords
}: endGameOpts): Stats | undefined {
  if (typeof localStorage === 'undefined') return;

  const savedStats = localStorage.getItem('trample-stats');
  const stats: Stats = savedStats ? JSON.parse(savedStats) : {};

  const { dayNumber: savedDayNumber } = stats;
  const dayNumber = getDayNumber();
  const firstGameToday =
    savedDayNumber === undefined || savedDayNumber !== dayNumber;
  if (!firstGameToday) return;

  const newStats: Stats = {
    // today's stats
    dayNumber,
    score,
    longestWord,
    // all-time stats
    bestScore: stats.bestScore
      ? score > stats.bestScore
        ? score
        : stats.bestScore
      : score,
  };

  mixpanel.track('FINISH_GAME', {...newStats, pastWords})
  localStorage.setItem('trample-stats-2', JSON.stringify(newStats));

  return getStats();
}

export function getStats(): Stats | undefined {
  if (typeof localStorage === 'undefined') return;
  const savedStats = localStorage.getItem('trample-stats-2');
  const stats = savedStats ? JSON.parse(savedStats) : {};
  return stats as Stats;
}

export function isGameOver(): boolean {
  const savedStats = localStorage.getItem('trample-stats-2');
  const stats = savedStats ? JSON.parse(savedStats) : {};
  const { dayNumber: savedDayNumber } = stats;
  const dayNumber = getDayNumber();
  const firstGameToday =
    savedDayNumber === undefined || savedDayNumber !== dayNumber;

  return !firstGameToday;
}
