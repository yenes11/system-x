'use client';

import api from '@/api';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/router';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  supportFullName: z.string().min(2).max(50),
  supportPhone: z.string().refine(validator.isMobilePhone),
  address: z.string().min(1),
  longitude: z.string(),
  latitude: z.string()
});

function AddWarehouseSheet() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const path = usePathname();
  const t = useTranslations();
  const id = (params?.id as string) || '';

  const columnName = path.startsWith('/customer/management')
    ? 'customerId'
    : 'fabricSupplierId';

  const endpoint = path.startsWith('/customer/management')
    ? '/Customers'
    : '/FabricSupplierWarehouses';

  const addWarehouse = useMutation({
    mutationKey: ['add-warehouse'],
    mutationFn: async (values: any) => {
      const res = await api.post(endpoint, values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      form.reset();
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      longitude: '',
      latitude: '',
      supportFullName: '',
      supportPhone: ''
    }
  });

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & {
      fabricSupplierId?: string;
      customerId?: string;
    }
  ) => {
    values[columnName] = id;
    addWarehouse.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-full bg-nutural" variant="outline">
          <PlusIcon className="mr-2" />
          {t('add_warehouse')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('add_warehouse')}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Fabric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('address')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('address_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('longitude')}</FormLabel>
                  <FormControl>
                    <Input placeholder="40.52" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('latitude')}</FormLabel>
                  <FormControl>
                    <Input placeholder="40.52" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('support_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('support_phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder="555 555 5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              loading={addWarehouse.isPending}
              className="w-full"
              type="submit"
            >
              {addWarehouse.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
        {/* )} */}
      </SheetContent>
    </Sheet>
  );
}

export default AddWarehouseSheet;
