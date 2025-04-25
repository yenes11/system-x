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
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const formSchema = z.object({
  name: z.string()
});

interface Props {
  state: DataState<Color>;
  setState: React.Dispatch<React.SetStateAction<DataState<Color>>>;
}

function EditColorSheet({ state, setState }: Props) {
  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: state.data?.name || ''
    }
  });

  const editColor = useMutation({
    mutationKey: ['edit-color', state.data?.id],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put('/Colors', {
        ...values,
        id: state.data?.id
      });
      return response;
    }
  });

  useEffect(() => {
    if (!state.open) return;
    form.reset();
  }, [state.open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editColor.mutate(values);
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
      title={t('edit_color')}
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
                  <Input
                    onChange={field.onChange}
                    defaultValue={state.data?.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            loading={editColor.isPending}
            className="w-full"
            type="submit"
          >
            {editColor.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditColorSheet;
