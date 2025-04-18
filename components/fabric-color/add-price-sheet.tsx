'use client';

import api from '@/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { currencyEnums } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
// import { useRouter } from 'next/router';

// const formSchema = z.object({
//   fabricSupplierFabricColorId: z.string().uuid(),
//   currency: z.number().min(1),
//   price: z.number().min(1)
// });

function AddPriceSheet() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const path = usePathname();
  const t = useTranslations();
  const id = (params?.id as string) || '';
  const queryClient = useQueryClient();

  const isMaterial = path.startsWith('/material');

  const idProperty = isMaterial
    ? 'supplierMaterialColorVariantId'
    : 'supplierFabricColorId';

  const supplierColorsEndpoint = isMaterial
    ? '/Suppliers/GetSuppliersForMaterialColorVariant?MaterialColorVariantId='
    : '/Suppliers/GetSuppliersForFabricColor?FabricColorId=';

  const addPriceEndpoint = isMaterial
    ? '/MaterialColorVariantPrices'
    : '/FabricColorPrices';

  const supplierElementPropertyName = isMaterial
    ? 'supplierMaterialColorVariantId'
    : 'supplierFabricColorId';

  const formSchema = z.object({
    [idProperty]: z.string().uuid(),
    currency: z.number().min(1),
    price: z.number().min(1)
  });

  const supplierColors = useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const res = await api.get(`${supplierColorsEndpoint}${id}`);
      return res.data;
    },
    staleTime: 0
  });

  const addPrice = useMutation({
    mutationKey: ['add-fabric-price'],
    mutationFn: async (values: any) => {
      const res = await api.post(addPriceEndpoint, {
        ...values
      });
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ['recent-prices']
      });
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [idProperty]: '',
      currency: 0,
      price: 0
    }
  });

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & {
      fabricSupplierId?: string;
      customerId?: string;
    }
  ) => {
    addPrice.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="" size="sm" variant="outline">
          <PlusIcon className="mr-2" />
          {t('add_price')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('add_price')}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('currency')}</FormLabel>
                  <Select onValueChange={(val) => field.onChange(Number(val))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_currency')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(currencyEnums)?.map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={idProperty}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('supplier')}</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_supplier')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supplierColors.data?.map((item: any) => (
                        <SelectItem
                          key={item.id}
                          value={item[supplierElementPropertyName]}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('price')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="250"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              loading={addPrice.isPending}
              className="w-full"
              type="submit"
            >
              {addPrice.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
        {/* )} */}
      </SheetContent>
    </Sheet>
  );
}

export default AddPriceSheet;
