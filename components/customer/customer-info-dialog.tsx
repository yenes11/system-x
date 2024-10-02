import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { CreditCard, Truck } from 'lucide-react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { Separator } from '../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { useTranslations } from 'next-intl';
import {
  Currency,
  currencyEnums,
  CustomerType,
  customerTypeEnums
} from '@/types';

interface Props {
  state: any;
  setState: any;
}

function CustomerInfoDialog({ state, setState }: Props) {
  const t = useTranslations();

  return (
    <Dialog
      open={state.open}
      onOpenChange={(val) => {
        setState((prev: any) => ({
          ...prev,
          open: val
        }));
      }}
    >
      <DialogContent className="max-h-[70%] overflow-auto p-0">
        <DialogHeader className="flex flex-row items-start bg-muted/50 px-6 py-4">
          <div className="grid gap-0.5">
            <DialogTitle className="group flex items-center gap-2 text-lg">
              {state.data?.name}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              ></Button>
            </DialogTitle>
          </div>
        </DialogHeader>
        <CardContent className="px-6 py-2 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">{t('customer_details')}</div>
            <ul className="grid gap-3">
              <li className="flex flex-col items-start justify-between">
                <span className="text-xs text-muted-foreground">
                  {t('appellation')}
                </span>
                <span>{state.data?.appellation}</span>
              </li>
              <li className="flex flex-col items-start justify-between">
                <span className="text-xs text-muted-foreground">
                  {t('address')}
                </span>
                <span>{state.data?.address}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('tax_administration')}
                </span>
                <span>{state.data?.taxAdministration}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('tax_no')}</span>
                <span>{state.data?.taxNo}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('description')}
                </span>
                <span>{state.data?.description}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('country')}</span>
                <span>{state.data?.country}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('type')}</span>
                <span>
                  {customerTypeEnums[state.data?.type as CustomerType]}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('currency')}</span>
                <span>{currencyEnums[state.data?.currency as Currency]}</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <DialogFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerInfoDialog;
