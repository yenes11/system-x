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
  SheetTitle
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import validator from 'validator';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { SupplierType } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  address: z.string().min(1).max(255),
  phone: z.string().refine((value) => {
    // Remove all whitespace for validation
    const cleanPhone = value.replace(/\s/g, '');
    return validator.isMobilePhone(cleanPhone, 'any', { strictMode: true });
  }),
  type: z.string(),
  authorizedPersonFullName: z.string().min(2).max(50),
  billingAddress: z.string().optional()
});

function EditSupplierSheet({ state, setState }: { state: any; setState: any }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  console.log(state, 'sss');

  const endpoint = '/Suppliers';

  const editSupplier = useMutation({
    mutationKey: ['edit-supplier'],
    mutationFn: async (values: any) => {
      const res = await api.put(endpoint, values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({
        data: undefined,
        open: false
      });
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: state.data
  });

  useEffect(() => {
    if (!state.data) return;
    form.reset({
      ...state.data,
      type: state.data.type.toString()
    });
  }, [state.data]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editSupplier.mutate({
      ...values,
      id: state.data.id,
      type: Number(values.type)
    });
  };

  let suppliers = { ...SupplierType } as Partial<typeof SupplierType>;
  if (state.data?.type === 2) {
    delete suppliers[3];
  } else if (state.data?.type === 3) {
    delete suppliers[2];
  }

  return (
    <Sheet
      open={state.open}
      onOpenChange={(val) =>
        setState((prev: any) => ({
          ...prev,
          open: val
        }))
      }
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('edit_supplier')}</SheetTitle>
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
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder="555 555 5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {state.data?.type !== 1 && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('type')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_item')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(suppliers)?.map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {t(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="authorizedPersonFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('authorized_person')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
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
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('billing_address')}</FormLabel>
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
            <Button
              loading={editSupplier.isPending}
              className="w-full"
              type="submit"
            >
              {editSupplier.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditSupplierSheet;
