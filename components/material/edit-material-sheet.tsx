'use client';

import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import api from '@/api';
import { BasicEntity, IMaterial, MaterialUnit } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { editMaterialFn } from '@/app/actions';
import Icon from '../ui/icon';
import moment from 'moment';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1),
  materialTypeId: z.string().uuid(),
  attributes: z.array(
    z.object({
      attributeId: z.string().uuid(),
      value: z.string()
    })
  )
});

interface EditMaterialSheetProps {
  state: {
    open: boolean;
    data: Partial<IMaterial> | null;
  };
  setState: (state: { open: boolean; data: Partial<IMaterial> | null }) => void;
}

function EditMaterialSheet({ state, setState }: EditMaterialSheetProps) {
  const t = useTranslations();
  const router = useRouter();

  const editMaterial = useMutation({
    mutationKey: ['edit-material'],
    mutationFn: async (material) => {
      const response = await api.put('/Materials', material);
      return response;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({ open: false, data: null });
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const attributes = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const res = await api.get('/Attributes');
      return res.data;
    }
  });

  const materialTypes = useQuery({
    queryKey: ['material-types'],
    queryFn: async () => {
      const res = await api.get('/MaterialTypes');
      return res.data as BasicEntity[];
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      materialTypeId: '',
      attributes: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes'
  });

  // ---BURASI DEĞİŞİM NEDENİYLE KAPATILDI DÜZELTİLECEK---
  useEffect(() => {
    if (materialTypes.data && state.data) {
      const type = materialTypes.data?.find(
        (t) => t.name === state.data?.type?.name
      );

      form.reset({
        name: state.data.name,
        materialTypeId: type?.id,
        attributes: state.data.attributes?.map((attr) => ({
          attributeId: attr.attributeId,
          value: attr.value
        }))
      });
    }

    if (state.data) {
    }
  }, [state.data, form, materialTypes.data]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editMaterial.mutate({
      ...values,
      id: state.data?.id
    } as any);
  };

  return (
    <Sheet
      open={state.open}
      onOpenChange={(open) => setState({ ...state, open })}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('edit_material')}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('material_name_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="materialTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('material_type')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('select_unit_placeholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {materialTypes.data?.map((type: BasicEntity) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div className="flex gap-2" key={field.id}>
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`attributes.${index}.attributeId` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('attribute')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="min-w-32">
                            <SelectValue
                              placeholder={t('select_attribute_placeholder')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes.data?.map((materialType: BasicEntity) => (
                            <SelectItem
                              key={materialType.id}
                              value={materialType.id}
                            >
                              {materialType.name}
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
                  name={`attributes.${index}.value` as any}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t('value')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  onClick={() => remove(index)}
                  variant="destructive"
                  className="mt-auto"
                >
                  <Icon icon="cross-circle" size={16} currentColor />
                </Button>
              </div>
            ))}

            <Button
              className="w-full"
              onClick={() => append({ attributeId: '', value: '' })}
              variant="outline"
              type="button"
            >
              {t('add_attribute')}
            </Button>

            <Button
              className="w-full"
              loading={editMaterial.isPending}
              type="submit"
            >
              {editMaterial.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditMaterialSheet;
