'use client';

import {
  BasicEntity,
  Color,
  DataState,
  ProductStationAddress
} from '@/lib/types';
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

interface Props {
  state: DataState<ProductStationAddress>;
  setState: React.Dispatch<
    React.SetStateAction<DataState<ProductStationAddress>>
  >;
}

function EditProductionStationAddressSheet({ state, setState }: Props) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: state.data?.name || '',
      productionStationId: state.data?.productionStation.id || '',
      phone: state.data?.phone || '',
      authorizedPersonFullName: state.data?.authorizedPersonFullName || '',
      address: state.data?.address || '',
      billingAddress: state.data?.billingAddress || ''
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
      setState({
        data: null,
        open: false
      });
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    addAddress.mutate(values);
  };

  if (productStations.isLoading || state.data === null) {
    return null;
  }

  return (
    <ThemedSheet
      open={state.open}
      setOpen={(open: boolean) => setState({ ...state, open })}
      title={t('add_color')}
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
                    defaultValue={state.data?.name}
                    placeholder={t('name')}
                    onChange={field.onChange}
                  />
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
                  <Input
                    defaultValue={state.data?.phone}
                    placeholder="555 555 5555"
                    onChange={field.onChange}
                  />
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
                  <Input
                    defaultValue={state.data?.authorizedPersonFullName}
                    placeholder="Jane Doe"
                    onChange={field.onChange}
                  />
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
                    defaultValue={state.data?.address}
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
                    defaultValue={state.data?.billingAddress}
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
                <Select
                  defaultValue={state.data?.productionStation.id}
                  onValueChange={field.onChange}
                >
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

export default EditProductionStationAddressSheet;
