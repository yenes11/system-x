import React, { useState } from 'react';
import ThemedSheet from '../themed-sheet';
import { useTranslations } from 'next-intl';
import Icon from '../ui/icon';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
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
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getFabricsWithColors } from '@/lib/api-calls';
import { FabricColor } from '@/lib/types';
import { Button } from '../ui/button';
import api from '@/api';
import { getFabricUrl } from '@/constants/api-constants';
import { toast } from '../ui/use-toast';
import { AxiosError } from 'axios';

const formSchema = z.object({
  fabric: z.string().uuid(),
  percentage: z.number().min(1).max(100),
  fabricColorId: z.string().uuid()
});

function AddFabricToCollectionSheet() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const fabricColors = useQuery({
    queryKey: ['fabric-colors'],
    queryFn: () => getFabricsWithColors({ pageIndex: 0, pageSize: 99999 }),
    select: (data) => data.items
  });

  // const fabrics = fabricColors.data.map(f => )

  const isFabricSelected = !!form.watch('fabric');

  const fabrics = useQuery({
    queryKey: ['fabrics'],
    queryFn: async () => {
      const res = await api.get(
        getFabricUrl({ pageIndex: 0, pageSize: 99999 })
      );
      return res.data;
    }
  });

  const fabricDetails = useQuery({
    queryKey: ['fabric-details', form.watch('fabric')],
    queryFn: async () => {
      const res = await api.get(`/Fabrics/${form.watch('fabric')}`);
      return res.data;
    },
    enabled: isFabricSelected
  });

  const assignFabricToCollection = useMutation({
    mutationFn: async (data: Partial<z.infer<typeof formSchema>>) => {
      const res = api.post('/CollectionColorFabrics', {
        fabricColorId: data.fabricColorId,
        collectionColorId: params?.id,
        percent: data.percentage
      });
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      form.reset();
      toast({
        title: t('success'),
        description: t('fabric_assigned_successfully')
      });
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as { Title: string };
      const errorMessage = responseData.Title || t('unknown_error');
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = async (values: Partial<z.infer<typeof formSchema>>) => {
    assignFabricToCollection.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={setOpen}
      title={t('add_fabric_to_collection')}
      triggerLabel={t('add_fabric_to_collection')}
      triggerIcon={<Icon className="mr-2" icon="plus" currentColor />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fabric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fabric')}</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue('fabricColorId', '');
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_a_fabric')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fabrics.data?.items?.map((fabric: any) => (
                      <SelectItem key={fabric.id} value={fabric.id}>
                        {fabric.name}
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
            name="fabricColorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('color')}</FormLabel>
                <Select
                  key={form.watch('fabric')}
                  disabled={!isFabricSelected}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_a_fabric_color')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fabricDetails.data?.colors?.map((color: any) => (
                      <SelectItem key={color.id} value={color.id}>
                        {color.name}
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
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('percentage')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="25"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
    </ThemedSheet>
  );
}

export default AddFabricToCollectionSheet;
