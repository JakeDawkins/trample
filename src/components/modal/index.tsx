import { PropsWithChildren, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  description: string;
}

export default function Modal({
  isOpen,
  setIsOpen,
  description,
  title,
  children,
}: PropsWithChildren<ModalProps>) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel
          className={
            'relative bg-white rounded max-w-[90%] max-h-[90%] overflow-y-scroll sm:p-2 lg:p-4'
          }
        >
          <button
            onClick={() => setIsOpen(false)}
            className={clsx(
              'hover:bg-gray-200',
              'flex rounded justify-center items-center h-10 w-10 absolute top-2 right-2',
            )}
          >
            X
          </button>
          <Dialog.Title
            className={'text-center sm:text-xl lg:text-2xl font-bold'}
          >
            {title}
          </Dialog.Title>
          <Dialog.Description className={'text-center'}>
            {description}
          </Dialog.Description>

          <div className="mt-0 flex flex-col pt-4 border-t border-t-gray-400">
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
