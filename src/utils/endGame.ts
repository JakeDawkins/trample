interface Stats {
  date: string;
  todaysBestScore: number;
  bestScore: number;
  todaysOneTimeScore: number;
  numWords: number;
  longestWord: number;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

interface endGameOpts {
  score: number;
}

// Save stats about today's game
export function endGame({ score }: endGameOpts): Stats | undefined {
  if (typeof localStorage === 'undefined') return;
  const savedStats = localStorage.getItem('trample-stats');
  const stats = savedStats ? JSON.parse(savedStats) : {};
  const { date, todaysBestScore, bestScore, todaysOneTimeScore } = stats;

  const firstGameToday = !date || date !== formatDate(new Date());

  console.log({ firstGameToday, score });

  localStorage.setItem(
    'trample-stats',
    JSON.stringify({
      date: firstGameToday ? formatDate(new Date()) : date,
      todaysOneTimeScore: firstGameToday ? score : todaysOneTimeScore || score,
      bestScore: bestScore ? (score > bestScore ? score : bestScore) : score,
      todaysBestScore: firstGameToday
        ? score
        : todaysBestScore
        ? score > todaysBestScore
          ? score
          : todaysBestScore
        : score,
    }),
  );

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
