import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import React from 'react';

interface Props {
  triggerLabel: string;
  title: string;
  children: React.ReactNode;
  triggerIcon?: React.ReactNode;
  headerIcon?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ThemedDialog({
  children,
  open,
  setOpen,
  title,
  triggerLabel,
  headerIcon,
  triggerIcon
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button>
            {triggerIcon}
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[70%] w-full max-w-3xl gap-0 overflow-auto p-0 sm:w-full">
        <DialogHeader className="flex flex-row items-start bg-muted/50 px-6 py-4">
          {headerIcon}
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default ThemedDialog;
