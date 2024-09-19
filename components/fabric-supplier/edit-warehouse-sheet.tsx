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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
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
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const path = usePathname();

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
      toast({
        title: res.statusText,
        description: new Date().toString()
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
                  <FormLabel>Name</FormLabel>
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
                  <FormLabel>Address</FormLabel>
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
                  <FormLabel>Longitude</FormLabel>
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
                  <FormLabel>Latitude</FormLabel>
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
                  <FormLabel>Suport Name</FormLabel>
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
                  <FormLabel>Support Phone</FormLabel>
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
              Submit
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditWarehouseSheet;
