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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  address: z.string().min(1).max(255),
  phone: z.string().refine(validator.isMobilePhone),
  authorizedPersonFullName: z.string().min(2).max(50),
  billingAddress: z.string().min(1).max(255)
});

function EditSupplierSheet({ state, setState }: { state: any; setState: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const editSupplier = useMutation({
    mutationKey: ['edit-supplier'],
    mutationFn: async (values: any) => {
      const res = await api.put('/FabricSuppliers', values);
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['fabric-suppliers']
      });
      setState({
        data: undefined,
        open: false
      });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: state.data
  });

  useEffect(() => {
    form.reset(state.data);
  }, [state.data]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editSupplier.mutate({
      ...values,
      id: state.data.id
    });
  };

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
        <SheetHeader>
          <SheetTitle>Add Supplier</SheetTitle>

          {/* <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription> */}
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="555 555 5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorizedPersonFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authorized Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
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
                    <Textarea placeholder="Address here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Address here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditSupplierSheet;
