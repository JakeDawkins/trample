import { BsArrowDownUp, BsArrowLeft, BsArrowRight } from 'react-icons/bs';

export type Action = 'insert-before' | 'insert-after' | 'swap';
type Props = {
  action: Action;
  active: boolean;
  onClick: () => void;
};

function getIcon(action: Action) {
  switch (action) {
    case 'insert-before':
      return BsArrowLeft;
    case 'insert-after':
      return BsArrowRight;
    case 'swap':
      return BsArrowDownUp;
  }
}

function getLabel(action: Action) {
  switch (action) {
    case 'insert-before':
      return 'insert letter before';
    case 'insert-after':
      return 'insert letter after';
    case 'swap':
      return 'swap letter';
  }
}

export default function ActionButton({ action, active, onClick }: Props) {
  const Icon = getIcon(action);
  const label = getLabel(action);
  return (
    <button
      className={`h-10 w-10 min-w-[40px] mr-4 mb-4 border border-r-2 border-b-2 rounded flex items-center justify-center ${
        active ? 'bg-green-600 border-green-900' : 'bg-white border-black'
      }`}
      onClick={onClick}
      aria-label={label}
      onDoubleClick={(e) => e.preventDefault()}
    >
      <Icon className={`h-6 w-6 ${active ? 'fill-white' : 'fill-black'}`} />
    </button>
  );
}
