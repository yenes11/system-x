import React from 'react';
import ThemedSheet from '../themed-sheet';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { CalendarIcon, Key, Plus } from 'lucide-react';
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
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { getSuppliers } from '@/lib/api-calls';
import { currencyEnums } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import api from '@/api';
import moment from 'moment';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
  // supplierId: z.string().uuid(),
  orderAmount: z.number().min(1),
  arrivalDate: z.string().optional(),
  estimatedArrivalDate: z.string().optional(),
  unitPrice: z.number().min(1),
  currency: z.string().min(1),
  status: z.string().min(1)
});

interface Props {
  state: any;
  setState: any;
}

const OrderStatus = {
  1: 'order_placed',
  2: 'to_be_continue',
  3: 'completed'
} as const;

function EditOrderSheet({ state, setState }: Props) {
  const t = useTranslations();
  const path = usePathname();
  const params = useParams();
  const router = useRouter();

  const isFabric = path.startsWith('/fabric');
  const createURL = isFabric
    ? '/FabricColorOrders'
    : '/MaterialColorVariantOrders';
  const propertyName = isFabric ? 'fabricColorId' : 'materialColorVariantId';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  React.useEffect(() => {
    if (state.data) {
      form.reset({
        status: state.data.status.toString(),
        currency: state.data.currency.toString(),
        unitPrice: state.data.unitPrice,
        estimatedArrivalDate: state.data.estimatedArrivalDate,
        orderAmount: state.data.orderAmount
      });
    }
  }, [state]);

  const updateOrder = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put(createURL, {
        ...values,
        currency: Number(values.currency),
        status: Number(values.status),
        id: state.data?.id
      });
      return response;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({
        open: false,
        data: null
      });
      form.reset();

      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  console.log(form.getValues(), 'vals');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateOrder.mutate(values);
  };

  return (
    <ThemedSheet
      open={state.open}
      setOpen={(value: boolean) =>
        setState((prev: any) => ({
          ...prev,
          open: value
        }))
      }
      title={t('place_order')}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(OrderStatus).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {t(value)}
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
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('currency')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
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
                      onSelect={(val) => {
                        console.log(val);
                        field.onChange(val?.toISOString());
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrivalDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('arrival_date')}</FormLabel>
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
            loading={updateOrder.isPending}
            className="w-full"
            type="submit"
          >
            {updateOrder.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditOrderSheet;
