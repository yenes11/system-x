import api from '@/api';
import { BasicEntity } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Minus, Plus, X } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Input } from '../ui/input';

const formSchema = z.object({
  items: z.array(
    z.object({
      sizeId: z.string().uuid(),
      barcode: z.string()
    })
  )
});

function AddBarcodeSheet() {
  const t = useTranslations();
  const params = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ sizeId: '', barcode: '' }] // Initialize with one field
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  const sizes = useQuery({
    queryKey: ['available-sizes'],
    queryFn: async (): Promise<BasicEntity[]> => {
      const response = await api.get(
        `/Sizes/GetSizesByCollectionColorId/${params.id}`
      );
      return response.data;
    }
  });

  const addBarcode = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = api.post(`/CollectionColorSizes/${params.id}`, data.items);
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['collection-colors', params.id]
      });
      setOpen(false);
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    addBarcode.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={setOpen}
      title={t('add_body_size')}
      trigger={
        <Button className="ml-auto" variant="outline">
          <Plus className="mr-2 size-4" />
          {t('add_body_size')}
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, index) => (
            <div
              className="relative -m-2 space-y-2 rounded-lg border p-4"
              key={field.id}
            >
              <Minus
                role="button"
                onClick={() => remove(index)}
                className="absolute right-2 top-2 box-border size-8 cursor-pointer rounded-full p-2 hover:bg-muted"
              />
              <FormField
                control={form.control}
                name={`items.${index}.sizeId`}
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
                name={`items.${index}.barcode`}
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
            </div>
          ))}

          <Button
            onClick={() => append({ sizeId: '', barcode: '' })}
            variant="outline"
            className="w-full"
            type="button"
          >
            <Plus className="mr-2 size-4" />
            {t('add_body_size')}
          </Button>

          <Button className="w-full" type="submit">
            {addBarcode.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default AddBarcodeSheet;
