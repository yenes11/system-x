'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import api from '@/api';
import { MaterialUnit } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Icon from '../ui/icon';

const formSchema = z.object({
  name: z.string().min(1, 'İsim gereklidir'),
  unit: z.number()
});

function AddMaterialSheet() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const addMaterial = useMutation({
    mutationKey: ['add-material'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post('/Materials', values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      form.reset();
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      unit: undefined
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMaterial.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Icon currentColor icon="plus" className="mr-2" />
          {t('add_material')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('add_material')}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('material_name_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('unit')}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('select_unit_placeholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(MaterialUnit).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {t(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              loading={addMaterial.isPending}
              type="submit"
            >
              {addMaterial.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default AddMaterialSheet;
