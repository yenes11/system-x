import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  triggerLabel?: string;
  title: string;
  children: React.ReactNode;
  triggerIcon?: React.ReactNode;
  headerIcon?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
          'flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5',
          contentClassName
        )}
      >
        <DialogHeader className="contents space-y-0 text-left">
          {headerIcon}
          <DialogTitle className="border-b px-6 py-4 text-base">
            {title}
          </DialogTitle>
          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
                  <div className="space-y-4">{children}</div>
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        {footer && (
          <DialogFooter className="border-t px-6 py-4 sm:items-center">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ThemedDialog;
