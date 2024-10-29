'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import api from '@/api';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { getMaterialUrl } from '@/constants/api-constants';
import {
  Select,
  SelectContent,
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
const MAX_FILE_SIZE = 5000000;

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name can be at most 50 characters'),
  materialId: z.string().uuid()
});

interface AddMaterialColorSheetProps {
  state: {
    open: boolean;
    id: string;
  };
  setState: (state: { open: boolean; id: string }) => void;
}

function AddMaterialColorSheet({
  state,
  setState
}: AddMaterialColorSheetProps) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      materialId: ''
    }
  });

  useEffect(() => {
    if (state.open) {
      form.reset({ name: '', materialId: state.id });
    }
  }, [state.id]);

  const addMaterialColor = useMutation({
    mutationKey: ['add-material-color'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post('/MaterialColors', values);
      return response;
    },
    onSuccess: (response) => {
      router.refresh();
      setState({ open: false, id: '' });
      form.reset();
      toast({
        title: response.statusText,
        description: new Date().toString()
      });
    },
    onError: (error) => {
      console.error('Error adding material color:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while adding the material color.',
        variant: 'destructive'
      });
    }
  });

  console.log(form.getValues(), 'values');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMaterialColor.mutate(values);
  };

  return (
    <Sheet
      open={state.open}
      onOpenChange={(open) => setState({ ...state, open })}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('add_new_material_color')}</SheetTitle>
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
                      placeholder={t('color_name_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="materialId"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t('material_type')}</FormLabel>
                  <Select onValueChange={onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('select_material_type_placeholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {materials.data?.map((material: any) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button
              loading={addMaterialColor.isPending}
              className="w-full"
              type="submit"
            >
              {addMaterialColor.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default AddMaterialColorSheet;
