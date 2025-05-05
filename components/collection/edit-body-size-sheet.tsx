'use client';

import { BodySize, Color, DataState } from '@/lib/types';
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

const formSchema = z.object({
  amount: z.number()
});

interface Props {
  state: DataState<BodySize>;
  setState: React.Dispatch<React.SetStateAction<DataState<BodySize>>>;
}

function EditBodySizeSheet({ state, setState }: Props) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: state.data?.amount || 0
    }
  });

  const editSize = useMutation({
    mutationKey: ['edit-body-size', state.data?.id],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put('/CollectionColorOrderDetails', {
        ...values,
        id: state.data?.id
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-sizes'] });
      setState({
        data: null,
        open: false
      });
      form.reset();
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  useEffect(() => {
    if (!state.open) return;
    form.reset();
  }, [state.open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editSize.mutate(values);
  };

  if (!state.data) return null;

  return (
    <ThemedSheet
      open={state.open}
      setOpen={(open: boolean) => {
        setState((prev) => ({
          ...prev,
          open
        }));
      }}
      title={t('edit_body_size')}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('amount')}</FormLabel>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    defaultValue={state.data?.amount}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button loading={editSize.isPending} className="w-full" type="submit">
            {editSize.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditBodySizeSheet;
