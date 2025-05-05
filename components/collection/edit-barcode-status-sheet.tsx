'use client';

import { Color, DataState, SizeBarcode } from '@/lib/types';
import React, { useEffect } from 'react';
import ThemedSheet from '../themed-sheet';
import { useTranslations } from 'next-intl';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import moment from 'moment';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useParams } from 'next/navigation';
import { SquarePen } from 'lucide-react';

const formSchema = z.object({
  status: z.string()
});

interface Props {
  state: DataState<{ status: number }>;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditBarcodeStatusSheet({ state, setState }: Props) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: state.data?.status.toString() || ''
    }
  });

  const editStatus = useMutation({
    mutationKey: ['edit-barcode-status', params.id],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put(
        '/CollectionColorOrders/UpdateBarcodeStatus',
        {
          ...values,
          id: params.id
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['collection-order', params.id]
      });
      setState(false);
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  useEffect(() => {
    if (!state.open) return;
    form.reset();
  }, [state.open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editStatus.mutate(values);
  };

  if (!state.data) return null;

  return (
    <ThemedSheet
      open={state.open}
      setOpen={(open: boolean) => {
        setState(open);
      }}
      title={t('edit_status')}
      trigger={
        <Button className="ml-auto" variant="secondary" size="sm">
          <SquarePen className="mr-2 size-4" />
          {t('edit')}
        </Button>
      }
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={state.data?.status.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_a_fabric_type')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(SizeBarcode).map(([key, value]) => (
                        <SelectItem
                          disabled={Number(key) < Number(state.data?.status)}
                          key={key}
                          value={key}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            loading={editStatus.isPending}
            className="w-full"
            type="submit"
          >
            {editStatus.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditBarcodeStatusSheet;
