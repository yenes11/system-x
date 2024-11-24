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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';

const formSchema = z.object({
  // fabricSupplierFabricColorId: z.string(),
  currency: z.number(),
  price: z.number()
});

interface EditState {
  open: boolean;
  materialColorId: string;
}

interface Props {
  state: EditState;
  setState: Dispatch<SetStateAction<EditState>>;
}

function AddPriceToMaterialSheet({ state, setState }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const addPrice = useMutation({
    mutationKey: ['edit-price-to-material'],
    mutationFn: async (values: any) => {
      const res = await api.post('/MaterialColorVariantPrices', values);
      return res;
    },
    onSuccess: async (res) => {
      router.refresh();
      form.reset({
        currency: null as any,
        price: null as any
      });
      setState({
        open: false,
        materialColorId: ''
      });
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & {
      supplierMaterialColorVariantId?: string;
    }
  ) => {
    values.supplierMaterialColorVariantId = state.materialColorId;
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
          <SheetTitle>{t('add_price')}</SheetTitle>
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

export default AddPriceToMaterialSheet;
