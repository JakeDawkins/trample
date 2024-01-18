import { useCallback } from 'react';
import getDayNumber from '../../utils/getDayNumber';

interface GameOverProps {
  score: number;
  bestScore?: number;
  numWords?: number;
  longestWord?: number;
  forfeit?: boolean;
  possibleWord?: string; 
}

export default function GameOver(props: GameOverProps) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <h2 className="text-2xl text-center font-bold">
        {props.forfeit ? 'Game Over' : "You've been trampled"}
      </h2>
      {props.forfeit ? <>
        <p className="text-center">You've gave up</p>
        {props.possibleWord ? <p>You could have played <strong>{props.possibleWord}</strong></p>: null}
      </>
       : null}

      <div className="flex flex-col border rounded border-black mt-8 overflow-hidden">
        <div className="p-4">
          <p className="text-lg font-bold">Trample #{getDayNumber()}</p>
          <p className="mt-2">
            🏆 Score: {props.score}
          </p>
          <p className="mt-2">🥇 Longest Word: {props.longestWord}</p>

          {props.bestScore ? (
            <p className="mt-2">🔥 Your Best Score Ever: {props.bestScore}</p>
          ) : null}
        </div>
        {typeof window?.navigator?.share !== 'undefined' ? (
          <div className="flex flex-col items-center w-full ">
            <button
              className="bg-black hover:bg-gray-900 text-white px-4 py-2 w-full"
              onClick={() => {
                window.navigator.share({
                  text: `Trample #${getDayNumber()}\n🏆 Score: ${
                    props.score
                  }\n🥇 Longest Word: ${props.longestWord}`,
                });
              }}
            >
              Share
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-center mt-8 ">Come back tomorrow for more!</p>
    </div>
  );
}
