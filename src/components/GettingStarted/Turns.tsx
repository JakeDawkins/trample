import clsx from 'clsx';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import LetterBankImg from './assets/letter-bank.jpg';
import LetterButton from '../letterButton';
import { useState } from 'react';

export default function Turns({ onNext }: { onNext: () => void }) {
  const [selectedLetterBankIndex, setSelectedLetterBankIndex] =
    useState<number | null>();

  return (
    <div className="flex flex-col items-start lg:items-center h-full">
      <h1 className="text-xl font-bold flex-0 self-center">Turns</h1>
      <p className="mt-4 flex-0">
        Your goal on each turn is to make a new word. This is where the word
        bank at the bottom of the screen comes in handy.
      </p>
      <p className="mt-4 flex-0">
        We&apos;ll talk about how to use these letters next
      </p>
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="flex w-full justify-center">
          <div className="flex flex-row flex-wrap mt-8 max-w-[300px] -mr-4">
            {['G', 'A', 'P', 'B', 'N', 'O', 'Q', 'A', 'H', 'R'].map(
              (letter, index) => {
                return (
                  <LetterButton
                    key={index}
                    letter={letter}
                    onClick={() => setSelectedLetterBankIndex(index)}
                    selected={selectedLetterBankIndex === index}
                  />
                );
              },
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onNext}
        className={clsx(
          'flex-0 flex items-center justify-center',
          'mt-4 px-2 py-1 border border-black hover:bg-black hover:text-white border-b-2 border-r-2 rounded-lg  w-full max-w-[480px]',
        )}
      >
        Next
        <BsArrowRight className="ml-2 inline-block" />
      </button>
    </div>
  );
}
