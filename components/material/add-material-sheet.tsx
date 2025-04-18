'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import api from '@/api';
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { BasicEntity } from '@/lib/types';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Icon from '../ui/icon';
import ComboboxForm from '../ui/combobox-form';
import SelectSearch from '../select-search';

const formSchema = z.object({
  name: z.string().min(1),
  materialTypeId: z.string().uuid(),
  attributes: z.array(
    z.object({
      attributeId: z.string().uuid(),
      value: z.string().min(1, { message: 'Required' })
    })
  )
});

function AddMaterialSheet() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const attributes = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const res = await api.get('/Attributes');
      return res.data;
    }
  });

  const materialTypes = useQuery({
    queryKey: ['material-types'],
    queryFn: async (): Promise<BasicEntity[]> => {
      const res = await api.get('/MaterialTypes');
      return res.data;
    },
    select: (data) => data.map((item) => ({ label: item.name, value: item.id }))
  });

  const addMaterial = useMutation({
    mutationKey: ['add-material'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post('/Materials', values);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      materialTypeId: '',
      attributes: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'attributes',
    control: form.control
  });

  const usedAttributes = fields.reduce((acc, field) => {
    acc.push(field.attributeId);
    return acc;
  }, [] as string[]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMaterial.mutate(values);
  };

  console.log(form.getValues(), 'forrrrr');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Icon currentColor icon="plus" className="mr-2" />
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
                  <SelectSearch
                    items={materialTypes.data || []}
                    value={field.value}
                    setValue={(value) => form.setValue('materialTypeId', value)}
                  />
                  {/* <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('select_material_type_placeholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {materialTypes.data?.map(
                          (materialType: BasicEntity) => (
                            <SelectItem
                              key={materialType.id}
                              value={materialType.id}
                            >
                              {materialType.name}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div className="flex items-end gap-2" key={field.id}>
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`attributes.${index}.attributeId` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('attribute')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.attributeId}
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
                <div>
                  <FormLabel></FormLabel>
                  <Button
                    onClick={() => remove(index)}
                    variant="destructive"
                    className="mt-auto"
                  >
                    <Icon icon="cross-circle" size={16} currentColor />
                  </Button>
                  <FormMessage />
                </div>
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
              loading={addMaterial.isPending}
              type="submit"
            >
              {addMaterial.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default AddMaterialSheet;
