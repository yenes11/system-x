import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useTranslations } from 'next-intl';

interface ThemedTooltipProps {
  children: React.ReactNode;
  text: string;
  asChild?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  disableHoverableContent?: boolean;
  disabled?: boolean;
}

function ThemedTooltip({
  children,
  text,
  asChild = true,
  side = 'top',
  disableHoverableContent,
  disabled
}: ThemedTooltipProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      open={disabled ? false : open}
      onOpenChange={setOpen}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <p>{t(text)}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default ThemedTooltip;
