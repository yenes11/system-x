'use client';

import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Command, CommandGroup, CommandItem } from './ui/command';
import { Button } from './ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TreeItem {
  label: string;
  value: string;
  children?: TreeItem[];
}

const treeData: TreeItem[] = [
  {
    label: 'Fruits',
    value: 'fruits',
    children: [
      {
        label: 'Apple',
        value: 'apple',
        children: [{ label: 'asdas', value: 'sadasd' }]
      },
      { label: 'Banana', value: 'banana' }
    ]
  },
  {
    label: 'Vegetables',
    value: 'vegetables',
    children: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Lettuce', value: 'lettuce' }
    ]
  }
];

const TreeSelect: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleSelect = (label: string) => {
    setSelectedItem(label);
    setOpen(false);
  };

  const toggleExpand = (value: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const renderTree = (items: TreeItem[], level = 0) => {
    return (
      <ul>
        {items.map((item) => (
          <li key={item.value}>
            {item.children ? (
              <div>
                <button
                  className={`flex w-full items-center px-2 py-1 text-left ${
                    level > 0 ? 'pl-4' : ''
                  }`}
                  onClick={() => handleSelect(item.label)}
                >
                  <span
                    className="mr-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.value);
                    }}
                  >
                    {expandedItems.has(item.value) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                  {item.label}
                </button>
                {expandedItems.has(item.value) && (
                  <div className="pl-4">
                    {renderTree(item.children, level + 1)}
                  </div>
                )}
              </div>
            ) : (
              <button
                className={`flex w-full items-center px-2 py-1 text-left pl-${
                  (level + 1) * 4
                }`}
                onClick={() => handleSelect(item.label)}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-between"
        >
          {selectedItem || 'Select an item'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        {renderTree(treeData)}
      </PopoverContent>
    </Popover>
  );
};

export default TreeSelect;
