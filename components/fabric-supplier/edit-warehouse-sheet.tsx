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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import validator from 'validator';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
// import { useRouter } from 'next/router';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  supportFullName: z.string().min(2).max(50),
  supportPhone: z.string().refine(validator.isMobilePhone),
  address: z.string().min(1),
  longitude: z.string(),
  latitude: z.string()
});

interface Props {
  state: any;
  setState: any;
}

function EditWarehouseSheet({ state, setState }: Props) {
  // const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const path = usePathname();
  const t = useTranslations();

  const endpoint = path.startsWith('/customer/management')
    ? '/CustomerWarehouses'
    : '/FabricSupplierWarehouses';

  const addWarehouse = useMutation({
    mutationKey: ['edit-warehouse'],
    mutationFn: async (values: any) => {
      const res = await api.put(endpoint, values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({
        data: null,
        open: false
      });
      toast.success(t('item_added'), {
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
    addWarehouse.mutate(values);
  };

  useEffect(() => {
    form.reset(state.data);
  }, [state.data]);

  return (
    <Sheet
      open={state.open}
      onOpenChange={(val) =>
        setState((prev: any) => ({
          ...prev,
          open: val
        }))
      }
    >
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Fabric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('address')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('longitude')}</FormLabel>
                  <FormControl>
                    <Input placeholder="40.52" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('latitude')}</FormLabel>
                  <FormControl>
                    <Input placeholder="40.52" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('support_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('support_phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder="555 555 5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              loading={addWarehouse.isPending}
              className="w-full"
              type="submit"
            >
              {addWarehouse.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditWarehouseSheet;
