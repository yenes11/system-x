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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { getMaterialUrl } from '@/constants/api-constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];
const MAX_FILE_SIZE = 5; // MB

const formSchema = z.object({
  material: z.string().uuid(),
  materialColorId: z.string().uuid(),
  manufacturerCode: z.string(),
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

interface Props {
  materialSupplierId: string;
}

function AssignMaterialSheet() {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  const params = useParams();
  const supplierId = params.id as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  const isFabricSelected = !!form.watch('material');

  const materials = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const res = await api.get(
        getMaterialUrl({ pageIndex: 0, pageSize: 99999 })
      );
      return res.data;
    }
  });

  // const fabricDetails = useQuery({
  //   queryKey: ['fabric-details', form.watch('material')],
  //   queryFn: async () => {
  //     const res = await api.get(`/Materials/${form.watch('material')}`);
  //     return res.data;
  //   },
  //   enabled: isFabricSelected
  // });

  const fabricDetails = useMemo(() => {
    const selectedMaterial = materials.data?.items?.find(
      (m: any) => m.id === form.watch('material')
    );
    return selectedMaterial?.colors;
  }, [materials.data, form.watch('material')]);

  const assignMaterial = useMutation({
    mutationKey: ['assign-material'],
    mutationFn: async (values: any) => {
      const res = await api.post('/SupplierMaterialColorVariants', values);
      return res;
    },
    onSuccess: async (res) => {
      router.refresh();
      setOpen(false);
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = (values: Partial<z.infer<typeof formSchema>>) => {
    const formData = new FormData();

    formData.append('supplierId', supplierId);
    formData.append('materialColorId', values.materialColorId || '');
    formData.append('manufacturerCode', values.manufacturerCode || '');
    formData.append('image', values.image);

    assignMaterial.mutate(formData);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          {t('add_material')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('add_material')}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('material')}</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue('materialColorId', '');
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_a_material')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {materials.data?.items?.map((material: any) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="materialColorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('color')}</FormLabel>
                  <Select
                    disabled={!isFabricSelected}
                    key={form.watch('material')}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('select_a_material_color')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {fabricDetails?.map((color: any) => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturerCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('manifacturer_code')}</FormLabel>
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
                      className="px-0 py-0"
                      accept="image/*"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              loading={assignMaterial.isPending}
              className="w-full"
              type="submit"
            >
              {t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default AssignMaterialSheet;
