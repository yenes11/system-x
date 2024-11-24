'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useCustomerDepartmentsSlice } from '@/store/customer-departments-slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { Building } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(2),
  parentCustomerDeparmentId: z.string().nullable(),
  customerId: z.string()
});

export function AddDepartmentSheet() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { isAddSheetOpen, setIsAddSheetOpen, parentId } =
    useCustomerDepartmentsSlice();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      parentCustomerDeparmentId: null
    }
  });

  useEffect(() => {
    form.reset({
      name: '',
      parentCustomerDeparmentId: parentId,
      customerId: params.id as string
    });
  }, [isAddSheetOpen, parentId]);

  const onOpenChange = (open: boolean) => {
    setIsAddSheetOpen(open, null);
  };

  const editDepartment = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post('/CustomerDepartments', values);
      return res.data;
    },
    onSuccess: () => {
      setIsAddSheetOpen(false, null);
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
      router.refresh();
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    editDepartment.mutate(values);
  }

  return (
    <Sheet open={isAddSheetOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
          <SheetTitle>{t('add_department')}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('department_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enter_department_name')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
