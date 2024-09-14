'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { _Icons } from '@/components/icons';
import { _navItems } from '@/constants/data';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { useLocale, useTranslations } from 'next-intl';
import React, { Dispatch, SetStateAction } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const t = useTranslations();
  const locale = useLocale();
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="no-scrollbar flex flex-1 flex-col gap-2 overflow-auto py-4">
      {_navItems.map((section, index) => {
        return (
          <React.Fragment key={section.key}>
            <span
              className={`inline-block flex-shrink-0 origin-left overflow-hidden text-gray-600 transition-all duration-500 ${
                isMinimized
                  ? 'ml-[50%] w-max translate-x-[-50%] text-xs delay-200'
                  : 'ml-6 translate-x-0 text-sm delay-0'
              }`}
            >
              {t(section.title)}
            </span>
            {section.children.map((item) => {
              const Icon = _Icons[item.key as keyof typeof _Icons];
              return (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'mx-3 flex flex-shrink-0 items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-primary/10',
                        path.includes(item.href)
                          ? 'bg-primary/40 text-emerald-700 hover:bg-primary/90 hover:text-emerald-100 dark:text-emerald-200'
                          : 'transparent'
                      )}
                      onClick={() => {
                        if (setOpen) setOpen(false);
                      }}
                    >
                      <Icon className={`ml-3 size-5 flex-none`} />

                      {isMobileNav || (!isMinimized && !isMobileNav) ? (
                        <span className="mr-2 truncate text-[13px] font-normal">
                          {t(item.title)}
                        </span>
                      ) : (
                        ''
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="right"
                    sideOffset={8}
                    className={!isMinimized ? 'hidden' : 'inline-block'}
                  >
                    {t(item.title)}
                  </TooltipContent>
                </Tooltip>
              );
            })}
            <div className="my-1 w-full"></div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
