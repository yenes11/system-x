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
import { getFabricUrl, getMaterialUrl } from '@/constants/api-constants';
import { toast } from '../ui/use-toast';
import { AxiosError } from 'axios';

const formSchema = z.object({
  material: z.string().uuid(),
  materialColor: z.string().uuid(),
  materialColorVariantId: z.string().uuid(),
  amount: z.number().min(1)
});

function AddMaterialToCollectionSheet() {
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

  const isMaterialSelected = !!form.watch('material');
  const isMaterialColorSelected = !!form.watch('materialColor');

  const materials = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const res = await api.get(
        getMaterialUrl({ pageIndex: 0, pageSize: 99999 })
      );
      return res.data;
    }
  });

  console.log(materials.data, 'materials');

  const colors = materials.data?.items?.find(
    (m: any) => m.id === form.watch('material')
  )?.colors;

  // const colors = materials.data?.items?.map((color: any) => ({
  //   id: color.id,
  //   name: color.name,
  //   variants: color.variants
  // }));

  const selectedColor = colors?.find(
    (c: any) => c.id === form.watch('materialColor')
  );

  const assignMaterialToCollection = useMutation({
    mutationFn: async (data: Partial<z.infer<typeof formSchema>>) => {
      const res = api.post('/CollectionColorMaterials', {
        materialColorVariantId: data.materialColorVariantId,
        collectionColorId: params?.id,
        amount: data.amount
      });
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      form.reset();
      toast({
        title: t('success'),
        description: t('material_assigned_successfully')
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
    assignMaterialToCollection.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={setOpen}
      title={t('add_material_to_collection')}
      triggerLabel={t('add_material_to_collection')}
      triggerIcon={<Icon className="mr-2" icon="plus" currentColor />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('material')}</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue('materialColor', '');
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_a_material')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {materials.data?.items?.map((material: any) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name}
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
            name="materialColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('color')}</FormLabel>
                <Select
                  disabled={!isMaterialSelected}
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue('materialColorVariantId', '');
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_a_color')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors?.map((color: any) => (
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
            name="materialColorVariantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('variant')}</FormLabel>
                <Select
                  key={form.watch('materialColorVariantId')}
                  disabled={!isMaterialColorSelected}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_a_variant')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedColor?.variants?.map((color: any) => (
                      <SelectItem key={color.id} value={color.id}>
                        {color.size}
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('amount')}</FormLabel>
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
            {assignMaterialToCollection.isPending
              ? t('submitting')
              : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default AddMaterialToCollectionSheet;
