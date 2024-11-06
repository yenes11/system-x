'use client';

import { useTranslations } from 'next-intl';
import ThemedDialog from '../themed-dialog';
import { useState } from 'react';
import Icon from '../ui/icon';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { BasicEntity } from '@/lib/types';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];
const MAX_FILE_SIZE = 5; // MB

const formSchema = z.object({
  customerId: z.string().uuid(),
  customerDepartmentId: z.string().uuid(),
  categoryId: z.string().uuid(),
  customerSeasonId: z.string().uuid(),
  sizeTypeId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  customerCode: z.string(),
  manufacturerCode: z.string(),
  garment1: z.string(),
  garment2: z.string(),
  designer: z.string(),
  buyer: z.string(),
  image: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE * 1_000_000,
      `Max image size is ${MAX_FILE_SIZE}MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
});

function AddCollectionDialog() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const selectedCustomerId = form.watch('customerId');

  const addCollection = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/Collections', formData);
      return res;
    }
  });

  const customers = useQuery({
    queryKey: ['all-customers'],
    queryFn: async () => {
      const res = await api.get('/Customers/GetAllCustomers');
      return res.data as BasicEntity[];
    }
  });

  const sizeTypes = useQuery({
    queryKey: ['size-types'],
    queryFn: async () => {
      const res = await api.get('/SizeTypes');
      return res.data;
    }
  });

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/Categories');
      return res.data;
    }
  });

  const departments = useQuery({
    queryKey: ['departments', selectedCustomerId],
    queryFn: async () => {
      const res = await api.get(`/CustomerDepartments/${selectedCustomerId}`);
      return res.data;
    }
  });

  const seasons = useQuery({
    queryKey: ['seasons', selectedCustomerId],
    queryFn: async () => {
      const res = await api.get(`/CustomerSeasons/${selectedCustomerId}`);
      return res.data;
    }
  });

  const onSubmit = (values: Partial<z.infer<typeof formSchema>>) => {
    const formData = new FormData();

    // formData.append('id', state.id);
    formData.append('ManufacturerCode', values.manufacturerCode || '');
    formData.append('Image', values.image);

    addCollection.mutate(formData);
  };

  return (
    <ThemedDialog
      title={t('add_collection')}
      open={open}
      setOpen={setOpen}
      triggerIcon={<Icon icon="plus" className="mr-2" currentColor size={16} />}
      triggerLabel={'add_collection'}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-x-4 gap-y-6 md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input placeholder="AS-YA01" {...field} />
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
                  <Input placeholder="AS-YA01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('customer_code')}</FormLabel>
                <FormControl>
                  <Input placeholder="AS-YA01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="garment1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`${t('garment')}-1`}</FormLabel>
                <FormControl>
                  <Input placeholder="AS-YA01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="garment2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`${t('garment')}-2`}</FormLabel>
                <FormControl>
                  <Input placeholder="AS-YA01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('designer')}</FormLabel>
                <FormControl>
                  <Input placeholder="AS-YA01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buyer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('buyer')}</FormLabel>
                <FormControl>
                  <Input placeholder="AS-YA01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>{t('image')}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...fieldProps}
                    accept="image/*"
                    className="px-0 py-0"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('customer')}</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('select_customer_placeholder')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.data?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('category')}</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('select_category_placeholder')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.data?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            {t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedDialog>
  );
}

export default AddCollectionDialog;
