import { useEffect, useRef } from 'react';

export default function ScoreAndHistory({
  score,
  history,
}: {
  score: number;
  history?: string[];
}) {
  const lastRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (lastRef.current) {
      lastRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 bg-black rainbow-box-sm text-white min-h-[85px]">
      <h2 className="font-bold text-lg">Score: {score}</h2>
      <div className="relative max-h-12 overflow-x-scroll text-center nowrap flex-nowrap">
        {history?.length ? (
          <ol className="nowrap" aria-label="previous words">
            {history.map((word, idx) => (
              <li
                key={idx}
                className="inline-block mr-2"
                ref={idx === history.length - 1 ? lastRef : null}
              >
                {word}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
