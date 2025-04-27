'use client';

import { Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
}

export default function StepProgress({
  steps = [
    { title: 'Step One', description: 'Desc for step one' },
    { title: 'Step Two', description: 'Desc for step two' },
    { title: 'Step Three', description: 'Desc for step three' }
  ],
  currentStep = 2,
  onChange
}: StepProgressProps) {
  return (
    <div className="w-full  p-6 text-foreground">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={index}
              className="relative flex w-full flex-col items-center"
            >
              {/* Step indicator */}
              <div
                className={`
                  z-10 flex h-10 w-10 items-center justify-center rounded-full border
                  ${
                    isCompleted
                      ? 'bg-foreground text-background'
                      : isCurrent
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className="absolute left-[50%] top-5 h-[1px] w-[100%] bg-gray-700"
                  style={{ transform: 'translateY(-50%)' }}
                />
              )}

              {/* Step text */}
              <div className="mt-4 text-center">
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-1 h-4 text-sm text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
