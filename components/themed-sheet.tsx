'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import React from 'react';
import { Button } from './ui/button';

interface Props {
  title: string;
  headerIcon?: React.ReactNode;
  children: React.ReactNode;
  triggerIcon?: React.ReactNode;
  triggerLabel?: string;
  open: boolean;
  setOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((value: boolean) => void);
  triggerClassName?: string;
}

function ThemedSheet({
  children,
  headerIcon,
  title,
  triggerIcon,
  triggerLabel,
  open,
  setOpen,
  triggerClassName
}: Props) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {triggerLabel && (
        <SheetTrigger asChild>
          <Button className={triggerClassName}>
            {triggerIcon}
            {triggerLabel}
          </Button>
        </SheetTrigger>
      )}
      <SheetContent>
        <SheetHeader>
          {headerIcon}
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default ThemedSheet;
