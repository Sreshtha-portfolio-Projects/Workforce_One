import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={clsx(
                    'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-base border-2 transition-all',
                    isCompleted && 'bg-primary-600 border-primary-600 text-white',
                    isCurrent && 'bg-primary-600 border-primary-600 text-white',
                    !isCompleted && !isCurrent && 'bg-white border-gray-300 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p
                    className={clsx(
                      'text-sm font-medium',
                      (isCompleted || isCurrent) ? 'text-primary-600' : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={clsx(
                    'flex-1 h-0.5 mx-4 transition-all',
                    isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
