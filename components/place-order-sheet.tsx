import React from 'react';
import ThemedSheet from './themed-sheet';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { CalendarIcon, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { getSuppliers } from '@/lib/api-calls';
import { currencyEnums } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import api from '@/api';
import moment from 'moment';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
  supplierId: z.string().uuid(),
  orderAmount: z.number().min(1),
  orderPlacedDate: z.string().datetime(),
  estimatedArrivalDate: z.string().datetime(),
  unitPrice: z.number().min(1),
  currency: z.number().min(1)
});

function PlaceOrderSheet() {
  const t = useTranslations();
  const path = usePathname();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const isFabric = path.startsWith('/fabric');
  const url = isFabric
    ? `/Suppliers/GetSuppliersForFabricColor?FabricColorId=${params.id}`
    : `/Suppliers/GetSuppliersForMaterialColorVariant?MaterialColorVariantId=${params.id}`;
  const createURL = isFabric
    ? '/FabricColorOrders'
    : '/MaterialColorVariantOrders';
  const propertyName = isFabric ? 'fabricColorId' : 'materialColorVariantId';

  const suppliers = useQuery({
    queryKey: ['suppliers', isFabric, params.id],
    queryFn: async () => {
      const response = await api.get(url);
      return response.data;
    }
    // select: (data) => {
    //   if (isFabric) {
    //     return data.items.filter((i) => i.type === 1 || i.type === 2);
    //   }
    //   return data.items.filter((i) => i.type === 1 || i.type === 3);
    // }
  });

  console.log(suppliers.data, 'sssd');

  const placeOrder = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post(createURL, {
        ...values,
        [propertyName]: params.id
      });
      return response;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      form.reset();

      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    placeOrder.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={setOpen}
      title={t('place_order')}
      trigger={
        <Button variant="outline" size="sm" className="ml-auto">
          <Plus className="mr-2 size-4" /> {t('place_order')}
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="orderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('amount')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('unit_price')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('currency')}</FormLabel>
                <Select onValueChange={(val) => field.onChange(Number(val))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">USD</SelectItem>
                    <SelectItem value="2">TRY</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('suppliers')}</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.data?.map((supplier: any) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
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
            name="orderPlacedDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('placed_date')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'bg-background pl-3 text-left font-normal active:hover:scale-100',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          moment(field.value).format('DD/MM/YYYY')
                        ) : (
                          <span>{t('pick_date')}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(val) => field.onChange(val?.toISOString())}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedArrivalDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('estimated_arrival_date')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'bg-background pl-3 text-left font-normal active:hover:scale-100',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          moment(field.value).format('DD/MM/YYYY')
                        ) : (
                          <span>{t('pick_date')}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(val) => field.onChange(val?.toISOString())}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            loading={placeOrder.isPending}
            className="w-full"
            type="submit"
          >
            {placeOrder.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default PlaceOrderSheet;
