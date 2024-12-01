'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
} from '@/components/ui/form';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { BasicEntity } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import moment from 'moment';
import { toast } from 'sonner';
import { NestedSelect } from '@/components/nested-select';
import { Heading } from '@/components/ui/heading';
import { Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  customerReceiverId: z.string().uuid(),
  customerProjectId: z.string().uuid(),
  customerSubProjectId: z.string().uuid(),
  customerBuyerGroupId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  customerCode: z.string(),
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

function NewCollectionPage() {
  const t = useTranslations();
  const router = useRouter();

  const [formResetKey, setFormResetKey] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const selectedCustomerId = form.watch('customerId');

  const addCollection = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/Collections', formData);
      return res;
    },
    onSuccess: (res) => {
      router.replace('/collection/library');
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
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
    },
    enabled: !!form.getValues('customerId')
  });

  console.log(categories.data, 'dddd');

  const seasons = useQuery({
    queryKey: ['seasons', selectedCustomerId],
    queryFn: async () => {
      const res = await api.get(`/CustomerSeasons/${selectedCustomerId}`);
      return res.data;
    }
  });
  const selectOptions = useQuery({
    queryKey: ['select-options', selectedCustomerId],
    queryFn: async () => {
      const res = await api.get(
        `/Collections/GetCustomerInfoForCollection?CustomerId=${selectedCustomerId}`
      );
      return res.data;
    }
  });

  console.log(sizeTypes.data, 'deps');

  const onSubmit = (values: Partial<z.infer<typeof formSchema>>) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    addCollection.mutate(formData);
  };

  return (
    <div>
      <Heading icon={<Layers />} title={t('add_collection')} description="" />
      <Card className="mt-4">
        <CardContent className="p-6">
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
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.resetField('customerDepartmentId');
                      }}
                    >
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
                name="customerDepartmentId"
                render={({ field }) => (
                  <FormItem key={form.getValues('customerId')}>
                    <FormLabel>{t('customer_department')}</FormLabel>
                    <FormControl>
                      <NestedSelect
                        disabled={!Boolean(selectedCustomerId)}
                        key={form.getValues('customerId')}
                        data={departments.data || []}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
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
                    <FormControl>
                      <NestedSelect
                        childrenKey="subCategories"
                        data={categories.data || []}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('category')}</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    >
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
              /> */}

              <FormField
                control={form.control}
                name="customerSeasonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('customer_season')}</FormLabel>
                    <Select
                      disabled={!Boolean(selectedCustomerId)}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('select_season_placeholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {seasons.data?.map((season: any) => (
                          <SelectItem key={season.id} value={season.id}>
                            {season.name}
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
                name="sizeTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('size_type')}</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('select_size_type_placeholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizeTypes.data?.map((sizeType: any) => (
                          <SelectItem key={sizeType.id} value={sizeType.id}>
                            {sizeType.name}
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
                name="customerReceiverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('customer_reciever')}</FormLabel>
                    <Select
                      disabled={!Boolean(selectedCustomerId)}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'select_customer_reciever_placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectOptions.data?.receivers.map((sizeType: any) => (
                          <SelectItem key={sizeType.id} value={sizeType.id}>
                            {sizeType.name}
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
                name="customerProjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('customer_project')}</FormLabel>
                    <Select
                      disabled={!Boolean(selectedCustomerId)}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'select_customer_project_placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectOptions.data?.projects.map((sizeType: any) => (
                          <SelectItem key={sizeType.id} value={sizeType.id}>
                            {sizeType.name}
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
                name="customerSubProjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('customer_sub_project')}</FormLabel>
                    <Select
                      disabled={!Boolean(selectedCustomerId)}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'select_customer_subproject_placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectOptions.data?.subProjects.map(
                          (sizeType: any) => (
                            <SelectItem key={sizeType.id} value={sizeType.id}>
                              {sizeType.name}
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
                name="customerBuyerGroupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('customer_buyer_group')}</FormLabel>
                    <Select
                      disabled={!Boolean(selectedCustomerId)}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('select_group_placeholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectOptions.data?.buyerGroups.map(
                          (sizeType: any) => (
                            <SelectItem key={sizeType.id} value={sizeType.id}>
                              {sizeType.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="mt-auto w-full" type="submit">
                {t('submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewCollectionPage;
