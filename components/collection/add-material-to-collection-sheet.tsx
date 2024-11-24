import api from '@/api';
import { getMaterialUrl } from '@/constants/api-constants';
import { getFabricsWithColors } from '@/lib/api-calls';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ThemedSheet from '../themed-sheet';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import Icon from '../ui/icon';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

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
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
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
