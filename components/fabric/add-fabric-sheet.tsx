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
import useFabricTypesQuery from '@/hooks/queries/useFabricTypesQuery';
import useFabricUnitsQuery from '@/hooks/queries/useFabricUnitsQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Origami } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ThemedSheet from '../themed-sheet';
import { Button } from '../ui/button';
import Icon from '../ui/icon';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  grammage: z.number().min(1),
  fabricUnitId: z.string().uuid(),
  fabricTypeId: z.string().uuid()
});

const defaultValues = {
  name: '',
  grammage: 0,
  fabricTypeId: '',
  fabricUnitId: ''
};

function AddFabricSheet() {
  const t = useTranslations();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const fabricTypes = useFabricTypesQuery({ enabled: open });
  const fabricUnits = useFabricUnitsQuery({ enabled: open });

  const addFabric = useMutation({
    mutationKey: ['add-fabric'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post('/Fabrics', values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
      form.reset();
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addFabric.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={setOpen}
      title={t('add_new_fabric')}
      triggerLabel={t('add_new_fabric')}
      triggerIcon={<Icon className="mr-2" currentColor size={16} icon="plus" />}
      headerIcon={<Origami size={18} className="mr-2 text-muted-foreground" />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
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
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_fabric_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      {fabricUnits.data?.map((fabricUnit) => (
                        <SelectItem key={fabricUnit.id} value={fabricUnit.id}>
                          {fabricUnit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
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
    </ThemedSheet>
  );
}

export default AddFabricSheet;
