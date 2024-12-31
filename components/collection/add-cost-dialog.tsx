import React from 'react';
import ThemedDialog from '../themed-dialog';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { CostType } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Button } from '../ui/button';

const formSchema = z.object({
  name: z.string().min(1),
  type: z.number().min(1),
  price: z.number().min(1)
});

function AddCostDialog() {
  const t = useTranslations();
  const params = useParams();
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const x = useQuery({
    queryKey: ['x'],
    queryFn: async () => {
      const response = await api.get(
        `/CollectionColors/GetCostInformationsForCreate/${params.id}`
      );
      return response.data;
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('add_cost')}</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-3xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex flex-col border-b border-border px-6 py-4 text-base">
            <span>{t('add_cost')}</span>
          </DialogTitle>
          <div className="overflow-y-auto px-6 py-4">
            <DialogDescription asChild>
              <div>
                <div className="mb-6">
                  <Label className="mb-1 inline-block">{t('name')}</Label>
                  <Input placeholder={t('Name')} />

                  <Label className="mb-1 mt-2 inline-block">{t('type')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_supplier')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CostType)?.map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {t(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-lg text-foreground">
                  {t('product_stations')}
                </span>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {x.data?.productStations.map((item: any) => (
                    <React.Fragment key={item.name}>
                      <Label>{item.name}</Label>
                      <span>{item.amount}</span>
                      <Input />
                    </React.Fragment>
                  ))}
                </div>

                <span className="mt-4 inline-block text-lg text-foreground">
                  {t('fabric')}
                </span>
                <div className="grid grid-cols-3 items-center gap-2">
                  {x.data?.fabrics.map((item: any) => (
                    <React.Fragment key={item.name}>
                      <Label>
                        {item.name}-{item.color}-{item.grammage}
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_item')} />
                        </SelectTrigger>
                        <SelectContent>
                          {item.unitMeters.map((unit: any, index: number) => (
                            <SelectItem key={index} value={unit.amount}>
                              {t(CostType[unit.type as keyof typeof CostType])}{' '}
                              - {unit.amount}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input type="number" />
                    </React.Fragment>
                  ))}
                </div>
                <span className="mt-4 inline-block text-lg text-foreground">
                  {t('material')}
                </span>
                <div className="mt-4 grid grid-cols-3 items-center gap-2">
                  {x.data?.materials.map((item: any) => (
                    <React.Fragment key={item.name}>
                      <Label>{item.name}</Label>
                      <span>{item.amount}</span>
                      <Input type="number" />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="border-t border-border px-6 py-4 sm:items-center">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">I agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddCostDialog;
