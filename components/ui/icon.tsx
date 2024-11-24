'use client';

import React from 'react';
import IcoMoon from 'icomoon-react';
import IconSet from '@/public/images/selection.json';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

function Icon({
  icon,
  size = 16,
  // color,
  currentColor = false,
  className,
  ...props
}: {
  icon: string;
  size?: number;
  // color?: string;
  currentColor?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const color = currentColor ? 'currentColor' : isDark ? '#5eead4' : '#0d9488';
  // const color = currentColor ? 'currentColor' : '#2563eb';

  return (
    <IcoMoon
      className={cn(className)}
      style={{
        minWidth: size,
        minHeight: size
      }}
      iconSet={IconSet}
      icon={icon}
      size={size}
      color={color}
      {...props}
    />
  );
}

export default Icon;
