'use client';

import {
  BasicEntity,
  BodySize,
  CollectionOrderDetails,
  Color,
  DataState
} from '@/lib/types';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import moment from 'moment';
import SelectSearch from '../select-search';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  amount: z.number(),
  collectionColorSizeId: z.string().uuid()
});

function AddBodySizeSheet() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const params = useParams();
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0
    }
  });

  const sizes = useQuery({
    queryKey: ['available-sizes', params.id],
    queryFn: async (): Promise<BasicEntity[]> => {
      const details = queryClient.getQueryData([
        'collection-order',
        params.id
      ]) as CollectionOrderDetails;
      const response = await api.get(
        `/Sizes/GetSizesByCollectionColorId/${details?.collection?.colorId}`
      );
      return response.data;
    }
  });

  const editSize = useMutation({
    mutationKey: ['add-body-size'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post('/CollectionColorOrderDetails', {
        ...values,
        collectionColorOrderId: params.id
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-sizes'] });

      form.reset();
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editSize.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={(open: boolean) => {
        setOpen(open);
      }}
      title={t('add_body_size')}
      trigger={
        <Button className="ml-auto" variant="secondary">
          <Plus className="mr-2" /> {t('add_body_size')}
        </Button>
      }
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
                  <Input placeholder="100" onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="collectionColorSizeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('body_size')}</FormLabel>
                <SelectSearch
                  items={
                    sizes.data?.map((i) => ({ label: i.name, value: i.id })) ||
                    []
                  }
                  value={field.value}
                  setValue={(value) =>
                    form.setValue('collectionColorSizeId', value)
                  }
                />
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

export default AddBodySizeSheet;
