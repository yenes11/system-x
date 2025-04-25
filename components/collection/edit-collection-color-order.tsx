'use client';

import api from '@/api';
import {
  CollectionColorOrder,
  CollectionOrderDetails,
  CostEnums,
  DataState,
  OrderStatus
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, Plus, SquarePen } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import PortalTooltip from '../portal-tooltip';
import ThemedSheet from '../themed-sheet';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { currencyEnums } from '@/types';
import { Badge } from '../ui/badge';
import { DataTable } from '../ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

const formSchema = z.object({
  amount: z.number().min(0),
  plmId: z.string().min(1),
  groupPlmId: z.string().min(1),
  status: z.string().min(1),
  approvedCostId: z.string().uuid(),
  realCostId: z.string().uuid().optional(),
  deadline: z.string()
});

interface Props {
  state: CollectionOrderDetails;
}

function EditCollectionColorOrderSheet({ state }: Props) {
  const t = useTranslations();
  const params = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      plmId: '',
      groupPlmId: '',
      approvedCostId: '',
      realCostId: '',
      deadline: '',
      status: '1'
    }
  });

  const approvedCosts = useQuery({
    queryKey: ['costs'],
    queryFn: async () => {
      const response = await api.get(
        `/CollectionColorCosts?PageIndex=0&PageSize=999&CollectionColorId=${params.id}&Type=3`
      );
      return response.data?.items;
    },
    enabled: !!params.id
  });

  const realCosts = useQuery({
    queryKey: ['costs'],
    queryFn: async () => {
      const response = await api.get(
        `/CollectionColorCosts?PageIndex=0&PageSize=999&CollectionColorId=${params.id}&Type=4`
      );
      return response.data?.items;
    },
    enabled: !!params.id
  });

  const sizes = useQuery({
    queryKey: ['sizes'],
    queryFn: async () => {
      const response = await api.get(
        `/CollectionColorSizes?PageIndex=0&PageSize=999&CollectionColorId=${params.id}`
      );
      return response.data?.items;
    },
    enabled: !!params.id
  });

  const addCollectionOrder = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = api.post(`/CollectionColorOrders`, {
        ...data,
        collectionColorId: params.id,
        status: parseInt(data.status)
      });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['collection-color-orders']
      });
      setOpen(false);
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  useEffect(() => {
    if (state && open) {
      form.reset({
        amount: state.order.amount || 0,
        plmId: state.order.plmId || '',
        groupPlmId: state.order.groupPlmId || '',
        approvedCostId: state.order.approvedCostId || '',
        realCostId: state.order.realCostId || '',
        deadline: state.order.deadline || '',
        status: state.order.status.toString() || '1'
      });
    }
  }, [state]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    addCollectionOrder.mutate(values);
  };

  if (!state) return null;

  return (
    <ThemedSheet
      trigger={
        <Button variant="secondary" className="mr-2" size="sm">
          <SquarePen className="mr-2 size-4" />
          {t('edit')}
        </Button>
      }
      open={open}
      setOpen={setOpen}
      title={t('update_order')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field: { name, onChange, ref } }) => (
              <FormItem>
                <FormLabel>{t('amount')}</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={state.order.amount}
                    placeholder="15"
                    type="number"
                    ref={ref}
                    name={name}
                    onChange={(e) => {
                      onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plmId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('plm_id')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="TYY11ER09"
                    defaultValue={state.order.plmId}
                    onChange={field.onChange}
                    ref={field.ref}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupPlmId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('group_plm_id')}</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={state.order.groupPlmId}
                    placeholder="TYY11ER09"
                    onChange={field.onChange}
                    ref={field.ref}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="approvedCostId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('approved_cost')}</FormLabel>
                <Select
                  defaultValue={state.order.approvedCostId}
                  name={field.name}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_item')} />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedCosts.data?.map((cost: any) => (
                      <div key={cost.id} className="relative flex items-center">
                        <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2">
                          <PortalTooltip
                            content={<TooltipContent item={cost.details} />}
                          >
                            <InfoCircledIcon className="size-4" />
                          </PortalTooltip>
                        </div>
                        <SelectItem value={cost.id} className="pl-8">
                          {cost.name}
                        </SelectItem>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="realCostId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('real_cost')}</FormLabel>
                <Select
                  defaultValue={state.order.realCostId}
                  name={field.name}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_item')} />
                  </SelectTrigger>
                  <SelectContent>
                    {realCosts.data?.map((cost: any) => (
                      <div key={cost.id} className="relative flex items-center">
                        <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2">
                          <PortalTooltip
                            content={<TooltipContent item={cost.details} />}
                          >
                            <InfoCircledIcon className="size-4" />
                          </PortalTooltip>
                        </div>
                        <SelectItem value={cost.id} className="pl-8">
                          {cost.name}
                        </SelectItem>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`status`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <Select
                  defaultValue={state.order.status.toString()}
                  name={field.name}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(OrderStatus).map(([key, value]) => {
                      if (!state) return;
                      const enabled = [
                        state.order.status,
                        state.order.status + 1
                      ].includes(parseInt(key));
                      return (
                        <SelectItem disabled={!enabled} key={key} value={key}>
                          {t(value)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('deadline')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'bg-background pl-3 text-left font-normal active:hover:scale-[100%]',
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
                      disabled={[{ before: new Date() }]}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            {addCollectionOrder.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditCollectionColorOrderSheet;

const TooltipContent = ({ item }: any) => {
  const t = useTranslations();

  const totalPrice: Record<number, number> = item.reduce(
    (acc: any, item: any) => {
      const total = item.unit * item.price;
      acc[item.currency] = (acc[item.currency] || 0) + total;
      return acc;
    },
    {} as Record<number, number>
  );

  const totalPriceString = Object.entries(totalPrice)
    .map(
      ([currency, total]) =>
        `${total.toFixed(2)} ${
          currencyEnums[currency as unknown as keyof typeof currencyEnums]
        }`
    )
    .join(' + ');

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'name'
    },
    {
      accessorKey: 'unit',
      header: 'unit'
    },
    {
      id: 'type',
      header: 'type',
      cell: ({ row }) => (
        <Badge className="py-0.5">
          {t(CostEnums[row.original.type as keyof typeof CostEnums])}
        </Badge>
      )
    },
    {
      id: 'price',
      header: 'price',
      cell: ({ row }) =>
        `${row.original.price} ${
          currencyEnums[row.original.currency as keyof typeof currencyEnums]
        }`
    }
  ];

  return (
    <DataTable
      rounded={false}
      searchKey=""
      className="max-w-2xl"
      columns={columns}
      data={item.sort((a: any, b: any) => a.type - b.type)}
      footer={
        <TableRow className="text-foreground">
          <TableCell colSpan={2}>{t('total')}</TableCell>
          <TableCell colSpan={2} className="text-right">
            {totalPriceString}
          </TableCell>
        </TableRow>
      }
    />
  );
};
