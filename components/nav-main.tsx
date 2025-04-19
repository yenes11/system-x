'use client';

import { CircleDot, Dot, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavMain({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      searchParams?: string;
    }[];
  }[];
}) {
  const t = useTranslations();
  const pathname = usePathname();

  const isActive = (url: string) => pathname.startsWith(url);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3">Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            // defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items ? (
                <Fragment>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="h-10 px-3 !font-normal"
                      tooltip={item.title}
                    >
                      {item.icon}
                      <span>{t(item.title)}</span>
                      {item.items && (
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="collapsibleDropdown">
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem
                          className="!mr-0 !pr-0"
                          key={subItem.title}
                        >
                          <SidebarMenuSubButton
                            className="!mr-0 h-10 !pr-0"
                            isActive={isActive(subItem.url)}
                            asChild
                          >
                            <Link
                              // data-active={isActive(subItem.url)}
                              href={
                                subItem.searchParams
                                  ? subItem.url + subItem?.searchParams
                                  : subItem.url
                              }
                            >
                              <CircleDot className="ml-2 !size-2" />
                              <span>{t(subItem.title)}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Fragment>
              ) : (
                <SidebarMenuButton
                  className="h-10 px-3 text-sm"
                  isActive={isActive(item.url)}
                  asChild
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{t(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
