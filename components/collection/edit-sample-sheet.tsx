'use client';

import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
import {
  collectionSampleStatus,
  collectionSampleType,
  UserInfo
} from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { useParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { CalendarIcon, Plus, PlusIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';

const dateDisplayedStatuses = ['2', '3', '4', '5'];
const dateNames = {
  '2': 'producedDate',
  '3': 'sentDate',
  '4': 'resultDate',
  '5': 'resultDate'
};

const dateLabels = {
  '2': 'produced_date',
  '3': 'sent_date',
  '4': 'result_date',
  '5': 'result_date'
};

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
  status: z.string().min(1),
  description: z.string().optional(),
  producedDate: z.string().optional(),
  sentDate: z.string().optional(),
  approvedDate: z.string().optional(),
  document: z
    .union([
      z.string(),
      z.object({
        size: z.number(),
        type: z.string()
      })
    ])
    .optional()
    .refine(
      (file: any) =>
        !file || file === '' || file.size <= MAX_FILE_SIZE * 1_000_000,
      `Max document size is ${MAX_FILE_SIZE}MB.`
    )
    .refine(
      (file: any) =>
        !file || file === '' || ACCEPTED_DOCUMENT_TYPES.includes(file.type),
      'Only .pdf, .doc, .docx formats are supported.'
    ),
  image: z
    .union([
      z.string(),
      z.object({
        size: z.number(),
        type: z.string()
      })
    ])
    .optional()
    .refine(
      (file: any) =>
        !file || file === '' || file.size <= MAX_FILE_SIZE * 1_000_000,
      `Max image size is ${MAX_FILE_SIZE}MB.`
    )
    .refine(
      (file: any) =>
        !file || file === '' || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
});

function isDisabled(status: number, index: number) {
  if (status === 4 || status === 5) {
    if (index === 4 || index === 5) return false;
    return true;
  }
  if (status === 3) {
    if (index === 3 || index === 4) return false;
    return true;
  }
  if (status === index) return false;
  return true;
}

export const EditSampleSheet = ({
  state,
  setState
}: {
  state: any;
  setState: any;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  console.log(state.data, 'state');
  const { data: user } = queryClient.getQueryData(['user-info']) as {
    data: UserInfo;
  };
  const updateSample = useMutation({
    mutationFn: async (values: FormData) => {
      const response = await api.put('/Samples', values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-samples'] });
      setState({
        open: false,
        data: null
      });
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  useEffect(() => {
    console.log(state.data, 'hellllll');
    form.reset({
      status: String(state.data?.status),
      type: String(state.data?.type),
      description: state.data?.description,
      ...(state.data?.producedDate && {
        producedDate: state.data.producedDate
      }),
      ...(state.data?.sentDate && { sentDate: state.data.sentDate }),
      ...(state.data?.resultDate && { resultDate: state.data.resultDate })
    });
  }, [state.data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      image: '',
      document: '',
      description: ''
    }
  });

  console.log(form.getValues('producedDate'), 'dateee');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as any);
      }
    });
    formData.append('id', state.data?.id as string);
    formData.append('userId', user?.id);
    formData.append('mantuamakerId', user?.id);
    formData.append('modelistId', user?.id);
    formData.append('collectionColorId', params?.id as string);
    updateSample.mutate(formData);
  };

  const selectedStatus = useWatch({
    control: form.control,
    name: 'status'
  });

  const isDateDisplayed = dateDisplayedStatuses.includes(selectedStatus);
  const dateName = dateNames[selectedStatus as keyof typeof dateNames];
  const dateLabel = dateLabels[selectedStatus as keyof typeof dateLabels];

  return (
    <ThemedSheet
      title={t('edit_sample')}
      open={state.open}
      setOpen={(val: any) => {
        setState((prev: any) => ({
          ...prev,
          open: val
        }));
      }}
      // triggerIcon={<Plus className="mr-2 size-5" />}
      // triggerLabel={t('add_sample')}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_item')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(collectionSampleStatus).map(
                      ([key, value], index) => (
                        <SelectItem
                          disabled={isDisabled(state?.data?.status, index)}
                          key={key}
                          value={key}
                        >
                          {t(value.toLocaleLowerCase())}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isDateDisplayed && (
            <FormField
              key={dateName}
              control={form.control}
              name={dateName as keyof typeof formSchema.shape}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t(dateLabel)}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            moment(field.value as string).format('LL')
                          ) : (
                            <span>{t('pick_date')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as any}
                        onSelect={(day) => field.onChange(day?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* <FormField
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
                      <SelectValue placeholder="Mantuamaker seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
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
                      <SelectValue placeholder="Modelist seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Görsel</FormLabel>
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
                  <Textarea placeholder={t('sample_description')} {...field} />
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
    </ThemedSheet>
  );
};
