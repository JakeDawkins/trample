import { useCallback } from 'react';

interface GameOverProps {
  score: number;
  bestScore?: number;
  numWords?: number;
  longestWord?: number;
  forfeit?: boolean;
}

export default function GameOver(props: GameOverProps) {
  const resetGame = useCallback(() => {
    if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
      localStorage.removeItem('trample-stats');
      window.location.reload();
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <h2 className="text-2xl text-center">
        {props.forfeit ? 'Game Over' : "You've been trampled"}
      </h2>
      {props.forfeit ? <p className="text-center">You've gave up</p> : null}

      <div className="flex flex-col border rounded border-black mt-8 overflow-hidden">
        <div className="p-4">
          <p className="text-lg">🏅 Score: {props.score} 🏅</p>
          {props.numWords ? (
            <p className="text-lg mt-2">Number of words: {props.numWords}</p>
          ) : null}
          {props.longestWord ? (
            <p className="text-lg mt-2">
              {/* Longest Word: {props.longestWord}{' '} */}
              Longest Word:
              {new Array(props.longestWord).fill('◻️').join('')}
            </p>
          ) : null}

          {props.bestScore ? (
            <p className="text-lg mt-2">
              Your Best Score Ever: {props.bestScore}
            </p>
          ) : null}
        </div>
        {typeof window?.navigator?.share !== 'undefined' ? (
          <div className="flex flex-col items-center w-full ">
            <button
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 w-full"
              onClick={() => {
                window.navigator.share({
                  title: `Trample ${props.score}\n${new Array(props.longestWord)
                    .fill('◻️')
                    .join('')}`,
                  text: `Trample ${props.score}\n${new Array(props.longestWord)
                    .fill('◻️')
                    .join('')}`,
                  url: 'https://tramplegame1234.vercel.app',
                });
              }}
            >
              Share
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-center mt-8 ">Come back tomorrow for more!</p>

      <button
        className="bg-black text-white rounded px-4 py-2 mt-8"
        onClick={resetGame}
      >
        Reset all stats and play again
      </button>
    </div>
  );
}
