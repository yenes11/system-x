'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { PlusIcon, SunSnow } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
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
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import moment from 'moment';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Sezon adı gereklidir' })
});

export function AddSeasonSheet() {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  const customerId = pathname.split('/').pop();

  const addSeason = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post('/CustomerSeasons', { ...values, customerId });
      return res.data;
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    addSeason.mutate(values);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-full bg-nutural" variant="outline">
          <PlusIcon size={16} className="mr-2" />
          {t('add_season')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SunSnow className="mr-2 text-icon" size={20} />

          <SheetTitle>{t('add_season')}</SheetTitle>
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
