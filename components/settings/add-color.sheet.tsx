'use client';

import { Color, DataState } from '@/lib/types';
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
import moment from 'moment';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string()
});

interface Props {
  state: DataState<Color>;
  setState: React.Dispatch<React.SetStateAction<DataState<Color>>>;
}

function AddColorSheet() {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  const addColor = useMutation({
    mutationKey: ['add-settings-color'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post('/Colors', values);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors-settings'] });
      setOpen(false);
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    addColor.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={(open: boolean) => setOpen(open)}
      title={t('add_color')}
      trigger={
        <Button className="ml-auto" size="sm" variant="secondary">
          <Plus className="mr-2 size-4" />
          {t('add_color')}
        </Button>
      }
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input placeholder="Blue" onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button loading={addColor.isPending} className="w-full" type="submit">
            {addColor.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default AddColorSheet;
