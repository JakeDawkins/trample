import clsx from 'clsx';
import { points } from '../../utils/getFullLetterBank';

export default function LetterButton({
  onClick,
  selected,
  disabled,
  last,
  letter,
}: {
  onClick: () => void;
  selected: boolean;
  disabled?: boolean;
  last?: boolean;
  letter: string;
}) {
  const value = points[letter];
  return (
    <button
      className={clsx(
        'relative h-10 w-10 min-w-[40px] mb-4 text-xl text-center border border-black rounded flex justify-center items-center',
        !last && 'mr-4',
        selected && 'bg-green-600 text-white font-bold border-0',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${letter}: ${value} points`}
      onDoubleClick={(e) => e.preventDefault()}
    >
      {letter}
      <div className="absolute top-[0px] right-[3px] text-xs font-normal">
        {value}
      </div>
    </button>
  );
}
