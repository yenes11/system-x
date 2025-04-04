import api from '@/api';
import {
  BasicEntity,
  CollectionColorOrder,
  DataState,
  OrderStatus
} from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, Divide, Plus } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Dispatch, Fragment, useEffect, useId, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ThemedSheet from '../themed-sheet';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tooltip, TooltipTrigger } from '../ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import PortalTooltip from '../portal-tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';

const formSchema = z
  .object({
    amount: z.number().min(0),
    plmId: z.string().min(1),
    groupPlmId: z.string().min(1),
    status: z.string().min(1),
    approvedCostId: z.string().uuid(),
    realCostId: z.string().uuid().optional(),
    deadline: z.string(),
    sizes: z.array(
      z.object({
        id: z.string().uuid(),
        amount: z.number().min(0)
      })
    )
  })
  .superRefine((data, ctx) => {
    // Calculate the sum of amounts within the sizes array
    const sumOfSizes = data.sizes.reduce((acc, size) => acc + size.amount, 0);

    // Compare the sum with the top-level amount
    if (data.amount !== sumOfSizes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // Use custom error code
        message: `The sum of size amounts (${sumOfSizes}) must equal the total amount (${data.amount})`,
        path: ['sizes'] // Attach the error message to the 'sizes' field
      });
    }
  });

interface Props {
  state: DataState<CollectionColorOrder>;
  setState: Dispatch<DataState<CollectionColorOrder>>;
}

function EditCollectionOrderSheet({ state, setState }: Props) {
  const t = useTranslations();
  const params = useParams();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sizes: [{ id: '', amount: 0 }] // Initialize with one field
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sizes'
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
      setState({ ...state, open: false });
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  useEffect(() => {
    if (state.data && state.open) {
      form.reset({
        amount: state.data?.amount || 0,
        plmId: state.data?.plmId || '',
        groupPlmId: state.data?.groupPlmId || '',
        // approvedCostId: state.data?.approvedCost?.id || '',
        // realCostId: state.data?.realCost?.id || '',
        deadline: state.data?.deadline || '',
        status: state.data?.status.toString() || '1'
      });
    }
  }, [state]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    addCollectionOrder.mutate(values);
  };

  return (
    <ThemedSheet
      open={state.open}
      setOpen={(open: boolean) => setState({ ...state, open })}
      title={t('add_order')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('amount')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="15"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      // console.log(first)
                      field.onChange(e.target.valueAsNumber);
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
                  <Input placeholder="TYY11ER09" {...field} />
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
                  <Input placeholder="TYY11ER09" {...field} />
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
                <Select value={field.value} onValueChange={field.onChange}>
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
                <Select value={field.value} onValueChange={field.onChange}>
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
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(OrderStatus).map(([key, value]) => {
                      if (!state.data) return;
                      const enabled = [
                        state.data.status,
                        state.data.status + 1
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

          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <FormField
                control={form.control}
                name={`sizes.${index}.id`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('size')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_item')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.data?.map((size: any) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.size}
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
                name={`sizes.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('amount')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="15"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Fragment>
          ))}

          {form.formState.errors.sizes?.root?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.sizes.root.message}
            </p>
          )}

          <Button
            onClick={() => append({ id: '', amount: 0 })}
            variant="outline"
            className="w-full"
            type="button"
          >
            <Plus className="mr-2 size-4" />
            {t('add_size')}
          </Button>

          <Button className="w-full" type="submit">
            {addCollectionOrder.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditCollectionOrderSheet;

const tableHeaders = ['name', 'unit', 'type', 'price'];

const TooltipContent = ({ item }: any) => {
  const t = useTranslations();
  return (
    <>
      <Table bordered={false}>
        <TableHeader className="">
          <TableRow>
            {tableHeaders.map((header, index) => (
              <TableHead key={index} className="text-xs">
                {t(header)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {item.map((row: any, rowIndex: number) => (
            <TableRow key={rowIndex}>
              {Object.entries(row).map(([key, value]: any, cellIndex) => {
                if (key === 'currency') return;
                return (
                  <TableCell key={cellIndex} className="py-1.5 text-xs">
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
