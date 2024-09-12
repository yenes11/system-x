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
  SheetTrigger
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from '@/components/ui/select';

const formSchema = z.object({
  // fabricSupplierFabricColorId: z.string(),
  currency: z.number(),
  price: z.number()
});

interface EditState {
  open: boolean;
  fabricColorId: string;
}

interface Props {
  state: EditState;
  setState: Dispatch<SetStateAction<EditState>>;
}

function AddPriceToFabricSheet({ state, setState }: Props) {
  const { toast } = useToast();
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const addPrice = useMutation({
    mutationKey: ['edit-price-to-fabric'],
    mutationFn: async (values: any) => {
      const res = await api.post('/FabricColorPrices', values);
      return res;
    },
    onSuccess: async (res) => {
      router.refresh();
      setState({
        open: false,
        fabricColorId: ''
      });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  // useEffect(() => {
  //   form.reset({ manufacturerCode: state.manufacturerCode });
  // }, [state.fabricColorId]);

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & {
      fabricSupplierFabricColorId?: string;
    }
  ) => {
    values.fabricSupplierFabricColorId = state.fabricColorId;

    addPrice.mutate(values);
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
          {/* <SheetTitle>Add new fabric</SheetTitle> */}

          {/* <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription> */}
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={(val) => field.onChange(Number(val))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={'1'}>TRY</SelectItem>
                        <SelectItem value={'2'}>USD</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="250"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default AddPriceToFabricSheet;
