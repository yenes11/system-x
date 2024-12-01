'use client';

import * as React from 'react';
import { Check, ChevronRight, ChevronDown, ChevronsUpDown } from 'lucide-react';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface NestedItem {
  name: string;
  id: string;
  [key: string]: any; // Dinamik çocuk elemanları desteklemek için
}

interface ComboboxNestedProps {
  data: NestedItem[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  childrenKey?: string; // Dinamik olarak alt elemanların property adı
}

export function NestedSelect({
  data,
  value,
  onChange,
  disabled = false,
  childrenKey = 'childs'
}: ComboboxNestedProps) {
  const [open, setOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItemName, setSelectedItemName] = React.useState('');

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filterData = (data: NestedItem[], query: string): NestedItem[] => {
    if (!query) return data;
    return data
      .map((item) => {
        const matchesQuery = item.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const filteredChildren = item[childrenKey]
          ? filterData(item[childrenKey], query)
          : [];
        if (matchesQuery || filteredChildren.length > 0) {
          return { ...item, [childrenKey]: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as NestedItem[];
  };

  const renderNestedItems = (items: NestedItem[]) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <CommandItem
          className="flex items-center space-x-2 py-2 pl-2 pr-4"
          onSelect={() => {
            onChange(item.id);
            setSelectedItemName(item.name);
            setOpen(false);
          }}
        >
          {item[childrenKey] && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 p-0"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the parent from being selected when clicking the caret
                toggleExpand(item.id);
              }}
            >
              {expandedItems[item.id] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
          )}
          <span className={cn('flex-1', !item[childrenKey] && 'pl-7')}>
            {item.name}
          </span>
          <Check
            className={cn(
              'ml-auto shrink-0',
              value === item.id ? 'opacity-100' : 'opacity-0'
            )}
          />
        </CommandItem>
        {item[childrenKey] && expandedItems[item.id] && (
          <CommandGroup className="pl-6">
            {renderNestedItems(item[childrenKey])}
          </CommandGroup>
        )}
      </React.Fragment>
    ));
  };

  const filteredData = filterData(data, searchQuery);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full flex-1 justify-between self-stretch"
        >
          {selectedItemName || 'Select an option...'}
          <ChevronsUpDown size={12} className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full flex-1 self-stretch p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            value={searchQuery}
            onValueChange={(val) => setSearchQuery(val)}
          />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>{renderNestedItems(filteredData)}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
