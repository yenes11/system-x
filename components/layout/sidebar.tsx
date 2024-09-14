'use client';
import React, { useLayoutEffect } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ArrowLeftToLine, ChevronLeft, ChevronsLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import { Label } from '../ui/label';

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
      <ArrowLeftToLine
        className={cn(
          'absolute top-4 z-50 cursor-pointer overflow-scroll rounded text-3xl text-foreground transition-all duration-700',
          isMinimized ? '-right-14 rotate-180' : 'right-4'
        )}
        onClick={handleToggle}
      />
      <div className="hidden h-14 w-64 items-center border-b border-r  p-6 md:flex">
        <Link href="/">
          <div className="box-border flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 flex-shrink-0"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <Label
              className={
                isMinimized ? 'hidden overflow-hidden' : 'overflow-hidden'
              }
            >
              SystemX
            </Label>
          </div>
        </Link>
      </div>

      <DashboardNav items={navItems} />
    </aside>
  );
}
