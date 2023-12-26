export default function LetterButton({
  onClick,
  children,
  selected,
  disabled,
  last,
}: {
  onClick: () => void;
  children: string;
  selected: boolean;
  disabled?: boolean;
  last?: boolean;
}) {
  return (
    <button
      className={`h-10 w-10 min-w-[40px] ${
        last ? '' : 'mr-4'
      } mb-4 text-xl text-center border border-black rounded flex justify-center items-center ${
        selected ? 'bg-[#008000] text-white font-bold border-0' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
