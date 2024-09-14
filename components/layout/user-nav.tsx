'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { URL_USER_INFO } from '@/constants/api-constants';
import api from '@/api';
import { useTranslations } from 'next-intl';
import cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const t = useTranslations();
  const { data: user } = useQuery({
    queryKey: ['user-info'],
    queryFn: () => api.get(URL_USER_INFO)
  });
  const router = useRouter();

  const initials = user?.data?.fullName
    ? user.data.fullName
        .split(' ')
        .map((name: string) => name[0])
        .join('')
    : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative  h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.data?.fullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.data?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            cookies.remove('session');
            router.push('/login');
          }}
        >
          {t('logout')}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
