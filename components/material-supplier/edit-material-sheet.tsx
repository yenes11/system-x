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

const formSchema = z.object({
  manufacturerCode: z.string()
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
  const { toast } = useToast();
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const editMaterial = useMutation({
    mutationKey: ['edit-material'],
    mutationFn: async (values: any) => {
      const res = await api.put('/materialSupplierMaterialColors', values);
      return res;
    },
    onSuccess: async (res) => {
      router.refresh();
      setState({
        open: false,
        materialColorId: '',
        manufacturerCode: ''
      });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  useEffect(() => {
    form.reset({ manufacturerCode: state.manufacturerCode });
  }, [state.materialColorId]);

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & {
      id?: string;
    }
  ) => {
    values.id = state.materialColorId;
    editMaterial.mutate(values);
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
