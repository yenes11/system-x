import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useTranslations } from 'next-intl';

interface ThemedTooltipProps {
  children: React.ReactNode;
  text: string;
  asChild?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

function ThemedTooltip({
  children,
  text,
  asChild = true,
  side = 'top'
}: ThemedTooltipProps) {
  const t = useTranslations();
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <p>{t(text)}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default ThemedTooltip;
