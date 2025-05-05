import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center text-nowrap rounded-md border px-2 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const lightModeColors: Record<string, string> = {
  red: 'bg-red-500/15 text-red-700',
  orange: 'bg-orange-500/15 text-orange-700',
  amber: 'bg-amber-500/15 text-amber-700',
  lime: 'bg-lime-500/15 text-lime-700',
  green: 'bg-green-500/15 text-green-700',
  emerald: 'bg-emerald-500/15 text-emerald-700',
  teal: 'bg-teal-500/15 text-teal-700',
  cyan: 'bg-cyan-500/15 text-cyan-700',
  sky: 'bg-sky-500/15 text-sky-700',
  blue: 'bg-blue-500/15 text-blue-700',
  indigo: 'bg-indigo-500/15 text-indigo-700',
  violet: 'bg-violet-500/15 text-violet-700',
  fuchsia: 'bg-fuchsia-500/15 text-fuchsia-700',
  rose: 'bg-rose-500/15 text-rose-700',
  zinc: 'bg-zinc-500/15 text-zinc-700',
  slate: 'bg-slate-500/15 text-slate-700'
};

const darkModeColors: Record<string, string> = {
  red: 'dark:bg-red-500/10 dark:text-red-400',
  orange: 'dark:bg-orange-500/10 dark:text-orange-400',
  amber: 'dark:bg-amber-500/10 dark:text-amber-400',
  lime: 'dark:bg-lime-500/10 dark:text-lime-400',
  green: 'dark:bg-green-500/10 dark:text-green-400',
  emerald: 'dark:bg-emerald-500/10 dark:text-emerald-400',
  teal: 'dark:bg-teal-500/10 dark:text-teal-400',
  cyan: 'dark:bg-cyan-500/10 dark:text-cyan-400',
  sky: 'dark:bg-sky-500/10 dark:text-sky-400',
  blue: 'dark:bg-blue-500/10 dark:text-blue-400',
  indigo: 'dark:bg-indigo-500/10 dark:text-indigo-400',
  violet: 'dark:bg-violet-500/10 dark:text-violet-400',
  fuchsia: 'dark:bg-fuchsia-500/10 dark:text-fuchsia-400',
  rose: 'dark:bg-rose-500/10 dark:text-rose-400',
  zinc: 'dark:bg-zinc-500/10 dark:text-zinc-400',
  slate: 'dark:bg-slate-500/10 dark:text-slate-400'
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, color, ...props }: BadgeProps) {
  const colorClasses =
    color && `${lightModeColors[color] || ''} ${darkModeColors[color] || ''}`;

  return (
    <div
      style={{ textWrap: 'nowrap' }}
      className={cn(badgeVariants({ variant }), className, colorClasses)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
