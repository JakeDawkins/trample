export default function ScoreAndHistory({
  score,
  history,
}: {
  score: number;
  history?: string[];
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 bg-black text-white min-h-[85px]">
      <h2>Score: {score}</h2>
      {history?.length ? (
        <ol>
          {history.map((word, idx) => (
            <li key={idx} className="inline-block mr-2">
              {idx > 0 ? <span className="mr-2">•</span> : ''}
              {word}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
