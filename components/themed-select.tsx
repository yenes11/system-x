import React, { useId } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { CaretDownIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { BasicEntity } from '@/lib/types';

interface Props<T> {
  placeholder: string;
  onValueChange: (value: string) => void;
  options: T[];
  value?: string;
  onClear?: () => void;
}

function ThemedSelect<T>({
  placeholder,
  value,
  onValueChange,
  options,
  onClear
}: Props<T>) {
  const id = useId();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        onClear={onClear}
        value={value}
        className="w-auto min-w-48"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options?.map((option: any) => {
          return (
            <SelectItem key={option.id + '-' + id} value={option.id}>
              {option.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default ThemedSelect;
