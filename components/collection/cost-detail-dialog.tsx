import React, { Dispatch, SetStateAction } from 'react';
import ThemedDialog from '../themed-dialog';
import { CostDetailItem, CostItem, CostType } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { currencyEnums } from '@/types';
import { Separator } from '../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Button } from '../ui/button';

interface Props {
  open: boolean;
  data: CostItem | null;
  setOpen: (val: boolean) => void;
}

function CostDetailDialog({ open, data, setOpen }: Props) {
  const t = useTranslations();

  if (!data) {
    return null;
  }

  return (
    // <ThemedDialog
    //   contentClassName="max-w-lg"
    //   open={open}
    //   setOpen={setOpen as Dispatch<SetStateAction<boolean>>}
    //   title={t('cost_details')}
    // >
    //   <div>
    //     <ul className="grid gap-3 text-sm">
    //       <li className="flex items-center justify-between">
    //         <span className="text-muted-foreground">{t('name')}</span>
    //         <span>{data.name}</span>
    //       </li>
    //       <li className="flex items-center justify-between">
    //         <span className="text-muted-foreground">{t('type')}</span>
    //         <span>{t(CostType[data.type as keyof typeof CostType])}</span>
    //       </li>
    //     </ul>
    //     <Separator className="mt-4" />
    //     <ul className="grid gap-1 divide-y text-sm">
    //       {data.details.map((item, index) => (
    //         <React.Fragment key={index}>
    //           <li className="mt-0 flex items-center justify-between pt-1">
    //             <span className="">{item.name}</span>
    //             <div className="flex flex-col items-end">
    //               <span>
    //                 {item.price}{' '}
    //                 {currencyEnums[item.currency as keyof typeof currencyEnums]}
    //               </span>
    //               <span className="text-xs text-muted-foreground">
    //                 {item.unit} {t('unit')}
    //               </span>
    //             </div>
    //           </li>
    //         </React.Fragment>
    //       ))}
    //     </ul>
    //   </div>
    // </ThemedDialog>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex flex-col border-b border-border px-6 py-4 text-base">
            <span>{t('cost_details')}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {data.name} - {t(CostType[data.type as keyof typeof CostType])}
            </span>
          </DialogTitle>
          <div className="overflow-y-auto py-2">
            <DialogDescription asChild>
              <ul className="grid gap-1 divide-y px-6 pb-4 text-sm">
                {data.details.map((item, index) => (
                  <React.Fragment key={index}>
                    <li className="mt-0 flex items-center justify-between pt-1">
                      <span className="">{item.name}</span>
                      <div className="flex flex-col items-end">
                        <span>
                          {item.price}{' '}
                          {
                            currencyEnums[
                              item.currency as keyof typeof currencyEnums
                            ]
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.unit} {t('unit')}
                        </span>
                      </div>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CostDetailDialog;
