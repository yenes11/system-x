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
      {/* <Icon
        icon="black-left-line"
        size={24}
        className={cn(
          'absolute top-4 z-50 cursor-pointer overflow-scroll rounded text-3xl text-foreground transition-all duration-700 ease-out',
          isMinimized ? '-right-14 rotate-180' : 'right-4'
        )}
        onClick={handleToggle}
      /> */}
      <svg
        onClick={handleToggle}
        className={cn(
          'absolute -right-14 top-4 z-50 cursor-pointer overflow-scroll rounded text-3xl text-foreground transition-all duration-700 ease-out',
          isMinimized ? ' rotate-180' : ''
        )}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.4"
          d="M22 7.81V16.19C22 19.83 19.83 22 16.19 22H7.81C7.61 22 7.41 21.99 7.22 21.98C5.99 21.9 4.95 21.55 4.13 20.95C3.71 20.66 3.34 20.29 3.05 19.87C2.36 18.92 2 17.68 2 16.19V7.81C2 4.37 3.94 2.24 7.22 2.03C7.41 2.01 7.61 2 7.81 2H16.19C17.68 2 18.92 2.36 19.87 3.05C20.29 3.34 20.66 3.71 20.95 4.13C21.64 5.08 22 6.32 22 7.81Z"
          fill="#0D9488"
        />
        <path
          d="M8.7207 2V22H7.8107C7.6107 22 7.4107 21.99 7.2207 21.98V2.03C7.4107 2.01 7.6107 2 7.8107 2H8.7207Z"
          fill="#0D9488"
        />
        <path
          d="M14.9696 15.3099C14.7796 15.3099 14.5896 15.2399 14.4396 15.0899L11.8796 12.5299C11.5896 12.2399 11.5896 11.7599 11.8796 11.4699L14.4396 8.90988C14.7296 8.61988 15.2096 8.61988 15.4996 8.90988C15.7896 9.19988 15.7896 9.67988 15.4996 9.96988L13.4796 11.9999L15.5096 14.0299C15.7996 14.3199 15.7996 14.7999 15.5096 15.0899C15.3596 15.2399 15.1696 15.3099 14.9696 15.3099Z"
          fill="#0D9488"
        />
      </svg>

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
