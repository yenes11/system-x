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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import useFabricTypesQuery from '@/hooks/queries/useFabricTypesQuery';
import useFabricUnitsQuery from '@/hooks/queries/useFabricUnitsQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useToast } from '../ui/use-toast';
import { addFabricFn } from '@/app/actions';
import { Origami } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '../ui/icon';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  grammage: z.number().min(1),
  fabricUnitId: z.string().uuid(),
  fabricTypeId: z.string().uuid()
});

function AddFabricSheet() {
  const fabricTypes = useFabricTypesQuery();
  const fabricUnits = useFabricUnitsQuery();
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();

  const addFabric = useMutation({
    mutationKey: ['add-fabric'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post('/Fabrics', values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
      form.reset();
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      grammage: 0,
      fabricTypeId: '',
      fabricUnitId: ''
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addFabric.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Icon className="mr-2" currentColor size={16} icon="plus" />
          {/* <PlusIcon className="mr-2" /> */}
          {t('add_new_fabric')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <Origami size={18} className="mr-2 text-muted-foreground" />
          <SheetTitle>{t('add_new_fabric')}</SheetTitle>
        </SheetHeader>

        {/* {fabricTypes.isLoading || fabricUnits.isLoading ? null : ( */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Keten" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grammage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('grammage')}</FormLabel>
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
            <FormField
              control={form.control}
              name="fabricTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fabric_type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_fabric_type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {fabricTypes.data?.map((fabricType) => (
                          <SelectItem key={fabricType.id} value={fabricType.id}>
                            {fabricType.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fabricUnitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fabric_unit')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_fabric_unit')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fabricUnits.data?.map((fabricUnit) => (
                        <SelectItem key={fabricUnit.id} value={fabricUnit.id}>
                          {fabricUnit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              loading={addFabric.isPending}
              className="w-full"
              type="submit"
            >
              {addFabric.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
        {/* )} */}
      </SheetContent>
    </Sheet>
  );
}

export default AddFabricSheet;
