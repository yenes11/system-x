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
import moment from 'moment';
import { toast } from 'sonner';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2)
});

export function EditDepartmentSheet() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { isEditSheetOpen, setEditSheet, editData } =
    useCustomerDepartmentsSlice();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      id: editData?.id
    }
  });

  useEffect(() => {
    form.reset({
      name: editData?.name,
      id: editData?.id
    });
  }, [isEditSheetOpen, editData]);

  const onOpenChange = (open: boolean) => {
    setEditSheet(
      {
        id: '',
        name: ''
      },
      open
    );
  };

  const editDepartment = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.put('/CustomerDepartments', values);
      return res.data;
    },
    onSuccess: () => {
      setEditSheet(
        {
          id: '',
          name: ''
        },
        false
      );
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
      router.refresh();
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    editDepartment.mutate(values);
  }

  return (
    <Sheet open={isEditSheetOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
          <SheetTitle>{t('edit_department')}</SheetTitle>
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
