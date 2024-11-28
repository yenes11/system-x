import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  triggerLabel: string;
  title: string;
  children: React.ReactNode;
  triggerIcon?: React.ReactNode;
  headerIcon?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  footer?: React.ReactNode;
  contentClassName?: string;
}

function ThemedDialog({
  children,
  open,
  setOpen,
  title,
  triggerLabel,
  headerIcon,
  triggerIcon,
  footer,
  contentClassName
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
      <DialogContent
        className={cn(
          'max-h-[90%] max-w-3xl gap-0 overflow-hidden p-0 sm:w-full',
          contentClassName
        )}
      >
        {/* Fixed Header */}
        <DialogHeader className="sticky top-0 z-10 flex max-h-12 flex-row items-start bg-muted/50 px-6 py-4">
          {headerIcon}
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="h-full overflow-auto p-4">{children}</div>

        {/* Footer (optional) */}
        {footer && (
          <DialogFooter className="flex flex-row items-center border-t bg-muted/50 px-4 py-3">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ThemedDialog;
