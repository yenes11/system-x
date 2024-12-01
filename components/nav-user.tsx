'use client';

import { BadgeCheck, Bell, LogOut, Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { CaretSortIcon, ComponentPlaceholderIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { URL_USER_INFO } from '@/constants/api-constants';
import { useTranslations } from 'next-intl';

export function NavUser({}: {}) {
  const { isMobile } = useSidebar();
  const t = useTranslations();

  const { data: user } = useQuery({
    queryKey: ['user-info'],
    queryFn: () => api.get(URL_USER_INFO)
  });

  const initials = user?.data?.fullName
    ? user.data.fullName
        .split(' ')
        .map((name: string) => name[0])
        .join('')
    : '';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg bg-accent">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.data?.fullName}
                </span>
                <span className="truncate text-xs">{user?.data?.email}</span>
              </div>
              <CaretSortIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'top'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.data?.fullName}
                  </span>
                  <span className="truncate text-xs">{user?.data?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2" size={16} />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
