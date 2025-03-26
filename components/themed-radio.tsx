'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useId, useState } from 'react';

export default function ThemedRadio() {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState('on');

  return (
    <div className="inline-flex h-9 rounded-md bg-input/50 p-0.5">
      <RadioGroup
        value={selectedValue}
        onValueChange={setSelectedValue}
        className="has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 after:shadow-xs has-focus-visible:after:ring-[3px] group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-sm after:bg-background after:transition-[translate,box-shadow] after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=off]:after:translate-x-0 data-[state=on]:after:translate-x-full"
        data-state={selectedValue}
      >
        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors group-data-[state=on]:text-muted-foreground/70">
          Bill Monthly
          <RadioGroupItem id={`${id}-1`} value="off" className="sr-only" />
        </label>
        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors group-data-[state=off]:text-muted-foreground/70">
          <span>
            Bill Yearly{' '}
            <span className="transition-colors group-data-[state=off]:text-muted-foreground/70 group-data-[state=on]:text-emerald-500">
              -20%
            </span>
          </span>
          <RadioGroupItem id={`${id}-2`} value="on" className="sr-only" />
        </label>
      </RadioGroup>
    </div>
  );
}
