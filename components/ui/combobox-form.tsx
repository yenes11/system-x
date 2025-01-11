import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { useTranslations } from 'next-intl';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command } from 'cmdk';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './command';
import { cn } from '@/lib/utils';

interface ComboboxFormProps {
  form: any;
  field: any;
  options: any[];
  label: string;
}

function ComboboxForm({ form, field, options, label }: ComboboxFormProps) {
  const t = useTranslations();
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{t(label)}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant="outline" role="combobox">
              {field.value
                ? options.find((option: any) => option.value === field.value)
                    ?.label
                : t('select_option')}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[100%] p-0">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {options.map((option: any) => (
                  <CommandItem
                    value={option.id}
                    key={option.id}
                    onSelect={() => {
                      form.setValue('language', option.id);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        option.value === field.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

export default ComboboxForm;
