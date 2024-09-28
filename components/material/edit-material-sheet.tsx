'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';

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
import { IMaterial, MaterialUnit } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { editMaterialFn } from '@/app/actions';

const formSchema = z.object({
  name: z.string().min(1, 'İsim gereklidir'),
  unit: z.number()
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
  const { toast } = useToast();

  const editMaterial = useMutation({
    mutationKey: ['edit-material'],
    // mutationFn: async (values: z.infer<typeof formSchema>) => {
    //   const res = await api.put(`/Materials`, {
    //     ...values,
    //     id: state.data?.id
    //   });
    //   return res;
    // },
    mutationFn: editMaterialFn,
    onSuccess: (res) => {
      router.refresh();
      setState({ open: false, data: null });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      unit: 0
    }
  });

  useEffect(() => {
    if (state.data) {
      form.reset({
        name: state.data.name,
        unit: state.data.unit
      });
    }
  }, [state.data, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editMaterial.mutate({
      ...values,
      id: state.data?.id
    });
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
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('unit')}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('select_unit_placeholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(MaterialUnit).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {t(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
