'use client';

import { BasicEntity, Color, DataState } from '@/lib/types';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import moment from 'moment';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

const formSchema = z.object({
  name: z.string(),
  productionStationId: z.string().uuid(),
  phone: z.string(),
  authorizedPersonFullName: z.string(),
  address: z.string(),
  billingAddress: z.string()
});

function AddProductionStationAddressSheet() {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      productionStationId: '',
      phone: '',
      authorizedPersonFullName: '',
      address: '',
      billingAddress: ''
    }
  });

  const productStations = useQuery<BasicEntity[]>({
    queryKey: ['product-stations'],
    queryFn: async () => {
      const response = await api.get('/ProductStations');
      return response.data;
    }
  });

  const addAddress = useMutation({
    mutationKey: ['add-settings-address'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post('/ProductStationAddresses', values);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses-settings'] });
      setOpen(false);
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    addAddress.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={(open: boolean) => setOpen(open)}
      title={t('add_color')}
      trigger={
        <Button className="ml-auto" size="sm" variant="secondary">
          <Plus className="mr-2 size-4" />
          {t('add_address')}
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
                  <Input placeholder={t('name')} onChange={field.onChange} />
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
                  <Input placeholder="555 555 5555" onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorizedPersonFullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('authorized_person')}</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" onChange={field.onChange} />
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
                  <Input
                    placeholder={t('address_placeholder')}
                    onChange={field.onChange}
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
                  <Input
                    placeholder={t('address_placeholder')}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productionStationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fabric_type')}</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {productStations.data?.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            loading={addAddress.isPending}
            className="w-full"
            type="submit"
          >
            {addAddress.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default AddProductionStationAddressSheet;
