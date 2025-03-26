'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useId, useState } from 'react';

export default function Component() {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState('1');

  return (
    <div className="inline-flex h-9 rounded-md bg-input/50 p-0.5">
      <RadioGroup
        value={selectedValue}
        onValueChange={setSelectedValue}
        className="has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 after:shadow-xs has-focus-visible:after:ring-[3px] group relative inline-grid grid-cols-3 items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/3 after:rounded-sm after:bg-background after:transition-[translate,box-shadow] after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=1]:after:translate-x-0 data-[state=2]:after:translate-x-full data-[state=3]:after:translate-x-[200%]"
        data-state={selectedValue}
      >
        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-3 transition-colors group-data-[state=2]:text-muted-foreground/70 group-data-[state=3]:text-muted-foreground/70">
          Option 1
          <RadioGroupItem id={`${id}-1`} value="1" className="sr-only" />
        </label>
        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-3 transition-colors group-data-[state=1]:text-muted-foreground/70 group-data-[state=3]:text-muted-foreground/70">
          Option 2
          <RadioGroupItem id={`${id}-2`} value="2" className="sr-only" />
        </label>
        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-3 transition-colors group-data-[state=1]:text-muted-foreground/70 group-data-[state=2]:text-muted-foreground/70">
          Option 3
          <RadioGroupItem id={`${id}-3`} value="3" className="sr-only" />
        </label>
      </RadioGroup>
    </div>
  );
}
