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
import useFabricTypesQuery from '@/hooks/queries/useFabricTypesQuery';
import useFabricUnitsQuery from '@/hooks/queries/useFabricUnitsQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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

const formSchema = z.object({
  name: z.string().min(2).max(50),
  grammage: z.number().min(1),
  fabricUnitId: z.string().uuid(),
  fabricTypeId: z.string().uuid()
});

interface Props {
  state: any;
  setState: any;
}

function AddFabricSheet({ state, setState }: Props) {
  const fabricTypes = useFabricTypesQuery({ enabled: true });
  const fabricUnits = useFabricUnitsQuery({ enabled: true });
  const router = useRouter();
  const t = useTranslations();

  const editFabric = useMutation({
    mutationKey: ['edit-fabric'],
    mutationFn: async (values: any) => {
      const res = await api.put('/Fabrics', values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({
        open: false,
        data: null
      });
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  useEffect(() => {
    if (!state.data || fabricTypes.isLoading || fabricUnits.isLoading) return;
    const unit = fabricUnits.data?.find((u) => u.name === state.data.unit);
    const type = fabricTypes.data?.find((t) => t.name === state.data.type);

    form.reset({
      ...state.data,
      fabricTypeId: type?.id,
      fabricUnitId: unit?.id
    });
  }, [state.data, fabricTypes.data, fabricUnits.data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & { id?: string }
  ) => {
    values.id = state.data.id;
    editFabric.mutate(values);
  };

  return (
    <Sheet
      open={state.open}
      onOpenChange={(val) => {
        setState((prev: any) => ({
          ...prev,
          open: val
        }));
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('edit_fabric')}</SheetTitle>
        </SheetHeader>

        {/* {fabricTypes.isLoading || fabricUnits.isLoading ? null : ( */}
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
                        <SelectValue placeholder={t('select_a_fabric_type')} />
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
                        <SelectValue placeholder={t('select_a_fabric_unit')} />
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
              loading={editFabric.isPending}
              className="w-full"
              type="submit"
            >
              {editFabric.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
        {/* )} */}
      </SheetContent>
    </Sheet>
  );
}

export default AddFabricSheet;
