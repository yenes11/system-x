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
  SheetTitle
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import moment from 'moment';
import { toast } from 'sonner';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];
const MAX_FILE_SIZE = 5; // MB

const formSchema = z.object({
  manufacturerCode: z.string(),
  image: z
    .any()
    .nullable()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE * 1_000_000,
      `Max image size is ${MAX_FILE_SIZE}MB.`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
});

interface EditState {
  open: boolean;
  materialColorId: string;
  manufacturerCode: string;
}

interface Props {
  state: EditState;
  setState: Dispatch<SetStateAction<EditState>>;
}

function EditMaterialSheet({ state, setState }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const editMaterial = useMutation({
    mutationKey: ['edit-material'],
    mutationFn: async (values: any) => {
      const res = await api.put('/SupplierMaterialColorVariants', values);
      return res;
    },
    onSuccess: async (res) => {
      router.refresh();
      setState({
        open: false,
        materialColorId: '',
        manufacturerCode: ''
      });
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  useEffect(() => {
    form.reset({ manufacturerCode: state.manufacturerCode });
  }, [state.materialColorId]);

  const onSubmit = (values: Partial<z.infer<typeof formSchema>>) => {
    const formData = new FormData();

    formData.append('id', state.materialColorId);
    formData.append('ManufacturerCode', values.manufacturerCode || '');
    formData.append('Image', values.image);

    editMaterial.mutate(formData);
  };

  return (
    <Sheet
      open={state.open}
      onOpenChange={(val) => {
        setState((prev) => ({
          ...prev,
          open: val
        }));
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('edit')}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="manufacturerCode"
              defaultValue={state.manufacturerCode}
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

            <Button
              loading={editMaterial.isPending}
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

export default EditMaterialSheet;
