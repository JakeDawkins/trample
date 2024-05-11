import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import Intro from './Intro';
import CurrentWord from './CurrentWord';
import Turns from './Turns';
import Actions from './Actions';
import Example from './Example';
import Summary from './Summary';
import { BsX } from 'react-icons/bs';

enum Steps {
  INTRO,
  CURRENT_WORD,
  TURNS,
  ACTIONS,
  EXAMPLE,
  SUMMARY,
}
export default function GettingStartedModal({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) {
  const [step, setStep] = useState<Steps>(Steps.INTRO);

  const handleNext = useCallback(() => {
    switch (step) {
      case Steps.INTRO:
        setStep(Steps.CURRENT_WORD);
        break;
      case Steps.CURRENT_WORD:
        setStep(Steps.TURNS);
        break;
      case Steps.TURNS:
        setStep(Steps.ACTIONS);
        break;
      case Steps.ACTIONS:
        setStep(Steps.EXAMPLE);
        break;
      case Steps.EXAMPLE:
        setStep(Steps.SUMMARY);
        break;
      default:
        handleClose();
        break;
    }
  }, [step, setStep]);

  const progress = useMemo(() => {
    if (step === Steps.INTRO) return 0;
    if (step === Steps.CURRENT_WORD) return 20;
    if (step === Steps.TURNS) return 40;
    if (step === Steps.ACTIONS) return 60;
    if (step === Steps.EXAMPLE) return 80;
    if (step === Steps.SUMMARY) return 100;
  }, [step]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center lg:p-4">
        <Dialog.Panel
          className={
            'relative bg-white rounded w-full h-full lg:max-w-[90%] lg:max-h-[90%] overflow-y-scroll p-4'
          }
        >
          <button
            onClick={handleClose}
            className={clsx(
              'hover:bg-gray-200',
              'flex rounded justify-center items-center h-10 w-10 absolute top-2 right-2',
            )}
          >
            <BsX className="h-6 w-6 fill-black flex-shrink-0" />
          </button>
          <div className="h-[4px] absolute top-0 left-0 right-0">
            <div
              className="h-[4px] bg-green-600 transition-all"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>

          {step === Steps.INTRO && <Intro onNext={handleNext} />}
          {step === Steps.CURRENT_WORD && <CurrentWord onNext={handleNext} />}
          {step === Steps.TURNS && <Turns onNext={handleNext} />}
          {step === Steps.ACTIONS && <Actions onNext={handleNext} />}
          {step === Steps.EXAMPLE && <Example onNext={handleNext} />}
          {step === Steps.SUMMARY && <Summary onNext={handleNext} />}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
