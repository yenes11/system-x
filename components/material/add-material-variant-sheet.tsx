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
import useIngredientsQuery from '@/hooks/queries/useIngredientsQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import ThemedSheet from '../themed-sheet';
import { Button } from '../ui/button';
import Icon from '../ui/icon';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useToast } from '../ui/use-toast';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];
const MAX_FILE_SIZE = 1000000;

const formSchema = z.object({
  size: z.string().min(2).max(50),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 1MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
  materialColorId: z.string().uuid()
  // IngredientId: z.string().uuid(),
  // IngredientPercentage: z.number().max(100)
});

interface Props {
  state: any;
  setState: any;
}

function AddMaterialVariantSheet({ state, setState }: Props) {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: '',
      materialColorId: '',
      image: null
    }
  });

  const addMaterialVariant = useMutation({
    mutationKey: ['add-material-variant'],
    mutationFn: async (formData: any) => {
      const res = await api.post('/MaterialColorVariants', formData);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({ id: '', open: false });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
      form.reset();
    },
    onError: (e) => {}
  });

  useEffect(() => {
    if (state.open) {
      form.reset({
        materialColorId: state.id,
        image: null,
        size: ''
      });
    }
  }, [state.id]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('Size', values.size);
    formData.append('MaterialColorId', values.materialColorId);
    formData.append('Image', values.image);

    addMaterialVariant.mutate(formData);
  };

  return (
    <ThemedSheet
      title={t('add_fabric_color')}
      open={state.open}
      setOpen={(val: any) => setState((prev: any) => ({ ...prev, open: val }))}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('size')}</FormLabel>
                <FormControl>
                  <Input placeholder="30cm" {...field} />
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
                    className=""
                    type="file"
                    {...fieldProps}
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
            loading={addMaterialVariant.isPending}
            className="w-full"
            type="submit"
          >
            {addMaterialVariant.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default AddMaterialVariantSheet;
