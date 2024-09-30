'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { _navItems } from '@/constants/data';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { useTranslations } from 'next-intl';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible';
import Icon from './ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

interface ExtendedNavItem extends NavItem {
  key: string;
  children?: ExtendedNavItem[];
}

interface NavSectionProps {
  section: ExtendedNavItem;
  isMinimized: boolean;
  t: (key: string) => string;
  path: string;
  toggleCollapse: (key: string) => void;
  collapsedRows: string[];
}

const NavLink: React.FC<{
  item: ExtendedNavItem;
  isMinimized: boolean;
  t: (key: string) => string;
  path: string;
}> = ({ item, isMinimized, t, path }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        href={item.href || ''}
        className={cn(
          'relative ml-9 flex flex-shrink-0 select-none items-center gap-2 border-l border-primary/50 px-6 py-2 text-sm font-medium hover:bg-primary/10'
        )}
      >
        {path.includes(item.href || '') && (
          <span className="absolute -left-[4.5px] h-2 w-2 rounded-full bg-primary" />
        )}
        {!isMinimized && (
          <span
            className={`mr-2 truncate text-[13px] font-normal ${
              path.includes(item.href || '') && 'text-primary'
            }`}
          >
            {t(item.title)}
          </span>
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

const NavSection: React.FC<NavSectionProps> = ({
  section,
  isMinimized,
  t,
  path,
  toggleCollapse,
  collapsedRows
}) => {
  const isCollapsed = !collapsedRows.includes(section.key);

  if (section.href && !section.children?.length) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={section.href}
            className={cn(
              'mx-3 flex flex-shrink-0 cursor-pointer select-none items-center gap-3 overflow-hidden rounded-md px-[13px] py-2 text-sm font-medium hover:bg-primary/10',
              path.includes(section.href) && 'bg-primary/40'
            )}
          >
            <Icon icon={section.icon || ''} size={20} />
            {!isMinimized && t(section.title)}
          </Link>
        </TooltipTrigger>
        <TooltipContent
          align="center"
          side="right"
          sideOffset={8}
          className={!isMinimized ? 'hidden' : 'inline-block'}
        >
          {t(section.title)}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (isMinimized) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="mx-3 flex flex-shrink-0 cursor-pointer select-none items-center gap-3 overflow-hidden rounded-md px-[13px] py-2 text-sm font-medium hover:bg-primary/10">
            <Icon icon={section.icon || ''} size={20} />
            {!isMinimized && t(section.title)}
            {!isMinimized && (
              <Icon
                className={`ml-auto transition-transform ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
                icon="down"
                size={16}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-40"
          sideOffset={16}
          align="start"
          side="right"
        >
          <DropdownMenuLabel>{t(section.title)}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {section.children?.map((item) => (
            <DropdownMenuItem key={item.key}>
              <Link href={item.href || ''}>{t(item.title)}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Collapsible
      open={!isCollapsed}
      onOpenChange={() => toggleCollapse(section.key)}
    >
      <CollapsibleTrigger asChild>
        <div className="mx-3 flex flex-shrink-0 cursor-pointer select-none items-center gap-3 overflow-hidden rounded-md px-[13px] py-2 text-sm font-medium hover:bg-primary/10">
          <Icon icon={section.icon || ''} size={20} />
          {!isMinimized && t(section.title)}
          {!isMinimized && (
            <Icon
              className={`ml-auto transition-transform ${
                !isCollapsed ? 'rotate-180' : ''
              }`}
              icon="down"
              size={16}
            />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="collapsibleDropdown">
        <div className="overflow-hidden">
          {section.children?.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              isMinimized={isMinimized}
              t={t}
              path={path}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const [collapsedRows, setCollapsedRows] = useState<string[]>(() => {
    const currentSection = _navItems.find((item) =>
      path.startsWith(`/${item.key}`)
    );
    if (currentSection?.children) {
      return [currentSection.key];
    }
    return [];
  });

  const { isMinimized } = useSidebar();
  const t = useTranslations();
  const _isMinimized = isMobileNav ? false : isMinimized;
  if (!items?.length) {
    return null;
  }

  const toggleCollapse = (key: string) => {
    setCollapsedRows((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <nav className="no-scrollbar flex flex-1 flex-col gap-2 overflow-auto py-4">
      {_navItems.map((section) => (
        <NavSection
          key={section.key}
          section={section as ExtendedNavItem}
          isMinimized={_isMinimized}
          t={t}
          path={path}
          toggleCollapse={toggleCollapse}
          collapsedRows={collapsedRows}
        />
      ))}
    </nav>
  );
}
