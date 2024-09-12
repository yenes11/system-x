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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { currencyEnums, customerTypeEnums } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  appellation: z.string().optional(),
  address: z.string().optional(),
  taxAdministration: z.string().optional(),
  taxNo: z.string().optional(),
  description: z.string().optional(),
  country: z.string().min(1),
  type: z.number().min(1),
  currency: z.number().min(1)
});

interface Props {
  state: any;
  setState: any;
}

function EditCustomerSheet({ state, setState }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state.data) {
      form.reset({
        ...state.data
      });
    }
  }, [state.data]);

  const editCustomer = useMutation({
    mutationKey: ['edit-customer'],
    mutationFn: async (values: any) => {
      const res = await api.put('/Customers', values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      form.reset();
      setState({
        open: false,
        data: null
      });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & {
      id?: string;
    }
  ) => {
    values.id = state.data.id;
    editCustomer.mutate(values);
  };

  return (
    <Sheet
      open={state.open}
      onOpenChange={(val) => {
        setState((prev: any) => ({
          ...prev,
          open: val
        }));
      }}
    >
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Trendyol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appellation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('appellation')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter appellation" {...field} />
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
                    <Textarea placeholder="Enter address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxAdministration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tax_administration')}</FormLabel>
                  <FormControl>
                    <Input placeholder="İstanbul" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tax_no')}</FormLabel>
                  <FormControl>
                    <Input placeholder="000000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('country')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Turkey" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('type')}</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(customerTypeEnums)?.map(
                        ([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('currency')}</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(currencyEnums)?.map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditCustomerSheet;
