'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';

import api from '@/api';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Sezon adı gereklidir' })
});

export function AddSeasonSheet() {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const { toast } = useToast();
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
      toast({
        title: t('success'),
        description: t('season_added_successfully')
      });
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as { Title: string };
      const errorMessage = responseData.Title || t('unknown_error');
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive'
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
