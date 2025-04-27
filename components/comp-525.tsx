import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from '@/components/ui/stepper';

interface Props {
  steps: {
    step: number;
    title: string;
    description: string;
  }[];
}

export default function OriginStepper({ steps }: Props) {
  return (
    <div className="space-y-8 text-center">
      <Stepper defaultValue={2}>
        {steps.map(({ step, title, description }) => (
          <StepperItem
            key={step}
            step={step}
            className="flex-1 last:flex-none md:items-center"
          >
            <StepperTrigger className="flex flex-col gap-2 rounded">
              <StepperIndicator />
              <div className="text-center">
                <StepperTitle>{title}</StepperTitle>
                <StepperDescription className="hidden sm:block">
                  {description}
                </StepperDescription>
              </div>
            </StepperTrigger>
            {step < steps.length && (
              <StepperSeparator className="mt-3.5 md:mx-4 md:mt-0" />
            )}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
}
