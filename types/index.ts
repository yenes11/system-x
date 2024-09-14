import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export const statusEnums = {
  1: 'Sipariş oluşturuldu',
  2: 'Devamı gelecek',
  3: 'Tamamlandı'
} as const;

export type Status = keyof typeof statusEnums;

export const currencyEnums = {
  1: 'USD',
  2: 'TRY'
} as const;

export const customerTypeEnums = {
  1: 'Production',
  2: 'Export'
};

export type Currency = keyof typeof currencyEnums;

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type CustomerType = keyof typeof currencyEnums;
