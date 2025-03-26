'use client';

import {
  Command,
  Disc3,
  Layers,
  LayoutGrid,
  Package2,
  SwatchBook,
  UserRound
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { URL_USER_INFO } from '@/constants/api-constants';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// This is sample data.

const navItems = [
  {
    title: 'dashboard',
    url: '/dashboard',
    icon: LayoutGrid,
    isActive: true
  },
  {
    title: 'fabric',
    url: '/fabric',
    icon: SwatchBook,
    isActive: true,
    items: [
      {
        title: 'fabric_library',
        url: '/fabric/library'
      },
      {
        title: 'orders',
        url: '/fabric/order?status=1'
      }
    ]
  },
  {
    title: 'material',
    url: '/material',
    icon: Disc3,
    isActive: true,
    items: [
      {
        title: 'material_library',
        url: '/material/library'
      },
      {
        title: 'orders',
        url: '/material/order?status=1'
      }
    ]
  },
  {
    title: 'collection',
    url: '/collection',
    icon: Layers,
    isActive: true,
    items: [
      {
        title: 'collection_library',
        url: '/collection/library'
      },
      {
        title: 'orders',
        url: '/collection/orders'
      }
    ]
  },
  {
    title: 'customer',
    url: '/customer/management',
    icon: UserRound,
    isActive: true
  },
  {
    title: 'supplier',
    url: '/supplier',
    icon: Package2,
    isActive: true
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useQuery({
    queryKey: ['user-info'],
    queryFn: () => api.get(URL_USER_INFO)
  });

  const company = user?.data?.company;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  {company?.logo ? (
                    <Avatar>
                      <AvatarImage src={company.logo} alt="Company Logo" />
                      <AvatarFallback>{company.name[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Command className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {company?.name}
                  </span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
