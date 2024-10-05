import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { CaretDownIcon, CrossCircledIcon } from '@radix-ui/react-icons';

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
        {options?.map((customer: any) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ThemedSelect;
