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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import ThemedSheet from '../themed-sheet';
import { generateBarcode } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import ThemedRadio from '../themed-radio';
import { Checkbox } from '../ui/checkbox';

const formSchema = z.object({
  isCompleted: z.string(),
  stocks: z.array(
    z.object({
      incomingAmount: z.number(),
      barcode: z.string()
    })
  )
});

interface EditState {
  open: boolean;
  materialColorId: string;
}

interface Props {
  state: EditState;
  setState: Dispatch<SetStateAction<EditState>>;
}

function AddStockSheet() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('off');

  const url = pathname.startsWith('/fabric')
    ? '/FabricColorStocks'
    : '/MaterialColorVariantStocks';

  const idName = pathname.startsWith('/fabric')
    ? 'fabricColorOrderId'
    : 'materialColorVariantOrderId';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isCompleted: 'false',
      stocks: [{ incomingAmount: 0, barcode: generateBarcode() }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stocks'
  });

  const addPrice = useMutation({
    mutationKey: ['add-stock', pathname],
    mutationFn: async (values: any) => {
      const res = await api.post(url, {
        ...values,
        isCompleted: values.isCompleted === 'true',
        [idName]: params.id
      });
      return res;
    },
    onSuccess: async (res) => {
      router.refresh();
      form.reset();
      setOpen(false);
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = (values: Partial<z.infer<typeof formSchema>>) => {
    addPrice.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={setOpen}
      title={t('add_stock')}
      trigger={
        <Button variant="outline" size="sm">
          <Plus className="mr-2 size-4" />
          {t('add_stock')}
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`stocks.${index}.incomingAmount`}
              render={({ field }) => (
                <div className="flex items-end gap-2">
                  <FormItem className="flex-1">
                    <FormLabel>{t('incoming_amount')}</FormLabel>
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
                  <Button
                    disabled={index === 0}
                    variant="destructive"
                    onClick={() => remove(index)}
                    size="icon"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}
            />
          ))}
          <FormField
            control={form.control}
            name="isCompleted"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t('status')}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t('completed')}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t('to_be_continue')}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('print')}
            </label>
          </div>
          <Button
            onClick={() =>
              append({ incomingAmount: 0, barcode: generateBarcode() })
            }
            className="w-full"
            type="button"
          >
            <Plus className="mr-2 size-4" />
            {t('append')}
          </Button>
          <Button className="w-full" type="submit">
            {t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default AddStockSheet;
