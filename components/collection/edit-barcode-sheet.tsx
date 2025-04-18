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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { BasicEntity } from '@/lib/types';

const formSchema = z.object({
  barcode: z.string().min(2).max(50),
  size: z.string().uuid()
});

interface Props {
  state: any;
  setState: any;
}

function EditBarcodeSheet({ state, setState }: Props) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const params = useParams();

  useEffect(() => {
    if (state.data) {
      form.reset({
        barcode: state.data.barcode,
        size: state.data.sizeId
      });
    }
  }, [state.data]);

  const sizes = useQuery({
    queryKey: ['available-sizes'],
    queryFn: async (): Promise<BasicEntity[]> => {
      const response = await api.get(
        `/Sizes/GetSizesByCollectionColorId/${params.id}`
      );
      return response.data;
    }
  });

  console.log(sizes, 'sizeee');

  const editCustomer = useMutation({
    mutationKey: ['edit-barcode'],
    mutationFn: async (values: any) => {
      const res = await api.put('/CollectionColorSizes', {
        ...values,
        id: state.data.id
      });
      return res;
    },
    onSuccess: (res) => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ['collection-colors', params.id]
      });
      setState({
        open: false,
        data: null
      });
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & {
      id?: string;
    }
  ) => {
    values.id = state.data.id;
    editCustomer.mutate(values);
  };

  return (
    <Sheet
      open={state.open}
      onOpenChange={(val) => {
        setState((prev: any) => ({
          ...prev,
          open: val
        }));
      }}
    >
      <SheetContent>
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>{t('edit_body_size')}</SheetTitle>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('body_size')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_item')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.data?.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
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
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('barcode')}</FormLabel>
                  <FormControl>
                    <Input placeholder="TYY11ER09" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              {editCustomer.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditBarcodeSheet;
