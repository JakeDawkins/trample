import clsx from 'clsx';
import { ComponentProps } from 'react';

export default function Button(props: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={clsx(
        `rounded flex items-center justify-center border border-r-2 border-b-2 border-black px-2`,
        'hover:bg-gray-100',
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
