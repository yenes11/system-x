'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import api from '@/api';
import { Button } from '@/components/ui/button';
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
  SheetTitle
} from '@/components/ui/sheet';
import moment from 'moment';
import { toast } from 'sonner';

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Sezon adı gereklidir' })
});

type State = {
  open: boolean;
  data: {
    id: string;
    name: string;
  };
};

interface Props {
  state: State;
  setState: (state: State) => void;
}

export function EditSeasonSheet({ state, setState }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: ''
    }
  });

  const addSeason = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.put('/CustomerSeasons', { ...values });
      return res.data;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({
        open: false,
        data: {
          id: '',
          name: ''
        }
      });
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  useEffect(() => {
    form.reset({
      id: state.data.id,
      name: state.data.name
    });
  }, [state.data]);

  const onOpenChange = (open: boolean) => {
    setState({
      open: open,
      data: state.data
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    addSeason.mutate(values);
  }

  return (
    <Sheet open={state.open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('edit_season')}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Fall Collection')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={addSeason.isPending}
            >
              {addSeason.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
