import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export const _navItems = [
  {
    key: 'home',
    title: 'home',
    children: [
      {
        key: 'dashboard',
        title: 'dashboard',
        href: '/dashboard'
      }
    ]
  },
  {
    key: 'fabric',
    title: 'fabric',
    children: [
      {
        key: 'fabric_library',
        title: 'library',
        href: '/fabric/library'
      },
      {
        key: 'fibric_stock_management',
        title: 'stock_management',
        href: '/fabric/stock-management'
      },
      {
        key: 'fabric_orders',
        title: 'orders',
        href: '/fabric/orders'
      },
      {
        key: 'fibric_supplier_management',
        title: 'supplier_management',
        href: '/fabric/supplier-management'
      }
    ]
  },
  {
    key: 'material',
    title: 'material',
    children: [
      {
        key: 'material_library',
        title: 'library',
        href: '/material/library'
      },
      {
        key: 'material_stock_management',
        title: 'stock_management',
        href: '/material/stock-management'
      },
      {
        key: 'material_orders',
        title: 'orders',
        href: '/material/orders'
      },
      {
        key: 'material_supplier_management',
        title: 'supplier_management',
        href: '/material/supplier-management'
      }
    ]
  },
  {
    key: 'collection',
    title: 'collection',
    children: [
      {
        key: 'collection_library',
        title: 'library',
        href: '/collection/library'
      },
      {
        key: 'collection_color_list',
        title: 'color_list',
        href: '/collection/color-list'
      },
      {
        key: 'collection_orders',
        title: 'color_orders',
        href: '/collection/color-orders'
      }
    ]
  },
  {
    key: 'customer',
    title: 'customer',
    children: [
      {
        key: 'customer_management',
        title: 'customer_management',
        href: '/customer/management'
      }
    ]
  }
];

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'User',
    href: '/dashboard/user',
    icon: 'user',
    label: 'user'
  },
  {
    title: 'Employee',
    href: '/dashboard/employee',
    icon: 'employee',
    label: 'employee'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile'
  },
  {
    title: 'Kanban',
    href: '/dashboard/kanban',
    icon: 'kanban',
    label: 'kanban'
  },
  {
    title: 'Login',
    href: '/',
    icon: 'login',
    label: 'login'
  }
];
