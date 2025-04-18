'use client';

import { useId, useState } from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ControllerRenderProps } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FormControl } from './ui/form';

const items = [
  {
    value: 'next.js',
    label: 'Next.js'
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit'
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js'
  },
  {
    value: 'remix',
    label: 'Remix'
  },
  {
    value: 'astro',
    label: 'Astro'
  },
  {
    value: 'angular',
    label: 'Angular'
  },
  {
    value: 'vue',
    label: 'Vue.js'
  },
  {
    value: 'react',
    label: 'React'
  },
  {
    value: 'ember',
    label: 'Ember.js'
  },
  {
    value: 'gatsby',
    label: 'Gatsby'
  },
  {
    value: 'eleventy',
    label: 'Eleventy'
  },
  {
    value: 'solid',
    label: 'SolidJS'
  },
  {
    value: 'preact',
    label: 'Preact'
  },
  {
    value: 'qwik',
    label: 'Qwik'
  },
  {
    value: 'alpine',
    label: 'Alpine.js'
  },
  {
    value: 'lit',
    label: 'Lit'
  }
];

type Item = {
  label: string;
  value: string;
};

interface Props {
  items: Item[];
  value: string;
  setValue: (value: string) => void;
  // field: ControllerRenderProps;
}

export default function SelectSearch({ items, value, setValue }: Props) {
  const id = useId();
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px] active:hover:!scale-[100%]"
            >
              <span
                className={cn('truncate', !value && 'text-muted-foreground')}
              >
                {value
                  ? items.find((item) => item.value === value)?.label
                  : t('select_item')}
              </span>
              <ChevronDownIcon
                size={16}
                className="shrink-0 text-muted-foreground/80"
                aria-hidden="true"
              />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={t('search')} />
            <CommandList>
              <CommandEmpty>{t('no_data')}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={(currentValue) => {
                      setValue(item.value === value ? '' : item.value);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    {value === item.value && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
