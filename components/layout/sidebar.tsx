'use client';
import React, { useLayoutEffect } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ArrowLeftToLine, ChevronLeft, ChevronsLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import { Label } from '../ui/label';
import Icon from '../ui/icon';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle, collapse } = useSidebar();

  useLayoutEffect(() => {
    const handleSideBar = () => {
      if (window.innerWidth < 950 && !isMinimized) {
        collapse();
      }
    };
    window.addEventListener('resize', handleSideBar);

    return () => {
      window.removeEventListener('resize', handleSideBar);
    };
  }, []);

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none flex-shrink-0 flex-col border-r bg-card transition-[width] duration-500 md:flex`,
        !isMinimized ? 'w-64' : 'w-[72px]',
        className
      )}
    >
      <Icon
        icon="black-left-line"
        size={24}
        className={cn(
          'absolute top-4 z-50 cursor-pointer overflow-scroll rounded text-3xl text-foreground transition-all duration-700 ease-out',
          isMinimized ? '-right-14 rotate-180' : 'right-4'
        )}
        onClick={handleToggle}
      />
      <div className="hidden h-14 w-64 items-center border-b border-r  p-6 md:flex">
        <Link className="box-border flex items-center gap-2" href="/dashboard">
          <Icon icon="abstract-25" size={24} />
          <span
            className={
              isMinimized
                ? 'hidden overflow-hidden'
                : 'overflow-hidden font-bold text-primary '
            }
          >
            SYSTEMX
          </span>
        </Link>
      </div>

      <DashboardNav items={navItems} />
    </aside>
  );
}
