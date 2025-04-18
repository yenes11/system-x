'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ThemedSheet from '../themed-sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { collectionSampleType, User, UserInfo } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { useParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { Plus, PlusIcon } from 'lucide-react';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 5; // MB

const formSchema = z.object({
  type: z.string().min(1),
  description: z.string().optional(),
  mantuamakerId: z.string().min(1),
  modelistId: z.string().min(1),
  document: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE * 1_000_000,
      `Max document size is ${MAX_FILE_SIZE}MB.`
    )
    .refine(
      (file) => ACCEPTED_DOCUMENT_TYPES.includes(file?.type),
      'Only .pdf, .doc, .docx formats are supported.'
    ),
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

export const AddSampleSheet = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { data: user } = queryClient.getQueryData(['user-info']) as {
    data: UserInfo;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      image: '',
      document: '',
      description: ''
    }
  });

  const createSample = useMutation({
    mutationFn: async (values: FormData) => {
      const response = await api.post('/Samples', values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-samples'] });
      setOpen(false);
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const mantuamakers = useQuery({
    queryKey: ['mantuamakers'],
    queryFn: async () => {
      const response = await api.get('/Users/GetUsersByType/5');
      return response.data as User[];
    }
  });

  const modelists = useQuery({
    queryKey: ['modelists'],
    queryFn: async () => {
      const response = await api.get('/Users/GetUsersByType/4');
      return response.data as User[];
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('userId', user?.id);
    formData.append('mantuamakerId', user?.id);
    formData.append('modelistId', user?.id);
    formData.append('collectionColorId', params?.id as string);
    createSample.mutate(formData);
  };

  return (
    <ThemedSheet
      title={t('add_sample')}
      open={open}
      setOpen={setOpen}
      triggerIcon={<Plus className="mr-2 size-5" />}
      triggerLabel={t('add_sample')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('type')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(collectionSampleType).map(
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
            name="mantuamakerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mantuamaker</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mantuamakers.data?.map((mantuamaker) => (
                      <SelectItem key={mantuamaker.id} value={mantuamaker.id}>
                        {mantuamaker.fullName}
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
            name="modelistId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelist</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modelists.data?.map((modelist) => (
                      <SelectItem key={modelist.id} value={modelist.id}>
                        {modelist.fullName}
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
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('document')}</FormLabel>
                <FormControl>
                  <Input
                    className="px-0 py-0"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
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
                  <Textarea placeholder={t('select_item')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            loading={createSample.isPending}
            className="w-full"
            type="submit"
          >
            {createSample.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
};
