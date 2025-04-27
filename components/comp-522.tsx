import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from '@/components/ui/stepper';

const steps = [
  {
    step: 1,
    title: 'Step One',
    description: 'Desc for step one'
  },
  {
    step: 2,
    title: 'Step Two',
    description: 'Desc for step two'
  },
  {
    step: 3,
    title: 'Step Three',
    description: 'Desc for step three'
  }
];

export default function Component() {
  return (
    <div className="space-y-8 text-center">
      <Stepper defaultValue={2}>
        {steps.map(({ step, title, description }) => (
          <StepperItem
            key={step}
            step={step}
            className="relative flex flex-1 flex-col"
          >
            <StepperTrigger className="flex flex-col gap-3 rounded">
              <StepperIndicator />
              <div className="space-y-1 px-2">
                <StepperTitle>{title}</StepperTitle>
                <StepperDescription className="hidden sm:block">
                  {description}
                </StepperDescription>
              </div>
            </StepperTrigger>
            {step < steps.length && (
              <StepperSeparator className="absolute inset-x-0 left-1/2 top-3 w-[calc(100%-1.5rem)] -translate-y-1/2" />
            )}
          </StepperItem>
        ))}
      </Stepper>
      <p
        className="mt-2 text-xs text-gray-500"
        role="region"
        aria-live="polite"
      >
        Stepper with titles and descriptions
      </p>
    </div>
  );
}
