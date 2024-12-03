import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';
import { Separator } from './ui/separator';

interface Props {
  actions: any[];
}

function ActionsDropdown({ actions }: Props) {
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="float-end" size="icon" variant="ghost">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {actions.map((action) => (
          <DropdownMenuItem
            className="text-sm"
            key={action.label}
            onClick={action.onClick}
          >
            {action.icon}
            {t(action.label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ActionsDropdown;
