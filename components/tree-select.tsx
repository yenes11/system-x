'use client';

import * as React from 'react';
import { ChevronDown, ChevronRight, Check, Dot, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
};

type TreeSelectProps = {
  data: TreeNode[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function TreeSelect({
  data,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled
}: TreeSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Find the selected node to display its label
  const findNodeLabel = (nodes: TreeNode[], id: string): string | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node.name;
      if (node.children) {
        const label = findNodeLabel(node.children, id);
        if (label) return label;
      }
    }
    return undefined;
  };

  const selectedLabel = value ? findNodeLabel(data, value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between bg-background active:hover:!scale-100',
            className
          )}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="max-h-[300px] overflow-auto p-1">
          {data.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              selectedValue={value}
              onSelect={(id) => {
                onChange(id);
                setOpen(false);
              }}
              level={0}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

type TreeNodeProps = {
  node: TreeNode;
  selectedValue?: string;
  onSelect: (id: string) => void;
  level: number;
};

function TreeNode({ node, selectedValue, onSelect, level }: TreeNodeProps) {
  const [expanded, setExpanded] = React.useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedValue;

  return (
    <div className="space-y-1">
      <div
        className={cn(
          'flex items-center space-x-2 rounded-md px-2 py-1.5 text-sm outline-none',
          'hover:bg-accent hover:text-accent-foreground',
          isSelected && 'bg-accent text-accent-foreground',
          'cursor-pointer'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelect(node.id)}
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(node.id);
          }
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <Circle className="ml-1 size-2 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1">{node.name}</span>
        {isSelected && <Check className="h-4 w-4" />}
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children!.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              selectedValue={selectedValue}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
