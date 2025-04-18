'use client';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import cookies from 'js-cookie';
import Icon from '../ui/icon';
import moment from 'moment';
type CompProps = {};
export default function LocaleDropdown({}: CompProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Icon
            currentColor
            icon="messages"
            className="h-[1.2rem] w-[1.2rem]"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            cookies.set('lang', 'tr-TR');
            moment.locale(['tr']);
            window.location.reload();
          }}
        >
          🇹🇷 Türkçe
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            cookies.set('lang', 'en-US');
            moment.locale(['en-gb']);
            window.location.reload();
          }}
        >
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
