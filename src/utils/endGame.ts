interface Stats {
  date: string;
  score: number;
  bestScore?: number;
  longestWord?: number;
  numWords?: number;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

interface endGameOpts {
  score: number;
  longestWord?: number;
}

// Save stats about today's game
export function endGame({
  score,
  longestWord,
}: endGameOpts): Stats | undefined {
  if (typeof localStorage === 'undefined') return;

  const savedStats = localStorage.getItem('trample-stats');
  const stats = savedStats ? JSON.parse(savedStats) : {};

  const { date } = stats;
  const firstGameToday = !date || date !== formatDate(new Date());
  if (!firstGameToday) return;

  const newStats: Stats = {
    date: formatDate(new Date()),
    // today's stats
    score: score,
    longestWord: longestWord,
    // all-time stats
    bestScore: stats.bestScore
      ? score > stats.bestScore
        ? score
        : stats.bestScore
      : score,
  };

  localStorage.setItem('trample-stats', JSON.stringify(newStats));

  return getStats();
}

export function getStats(): Stats | undefined {
  if (typeof localStorage === 'undefined') return;
  const savedStats = localStorage.getItem('trample-stats');
  const stats = savedStats ? JSON.parse(savedStats) : {};
  return stats as Stats;
}

export function isGameOver(): boolean {
  const savedStats = localStorage.getItem('trample-stats');
  const stats = savedStats ? JSON.parse(savedStats) : {};
  const { date } = stats;

  const firstGameToday = !date || date !== formatDate(new Date());

  return !firstGameToday;
}
