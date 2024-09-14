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
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { getFabrics } from '@/lib/api-calls';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter } from 'next/navigation';
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

const formSchema = z.object({
  fabric: z.string().uuid(),
  fabricColorId: z.string().uuid(),
  manufacturerCode: z.string()
});

interface Props {
  fabricSupplierId: string;
}

function AssignFabricSheet() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const params = useParams();
  const fabricSupplierId = params.id as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  const isFabricSelected = !!form.watch('fabric');

  const fabrics = useQuery({
    queryKey: ['fabrics'],
    queryFn: getFabrics
  });

  const fabricDetails = useQuery({
    queryKey: ['fabric-details', form.watch('fabric')],
    queryFn: async () => {
      const res = await api.get(`/Fabrics/${form.watch('fabric')}`);
      return res.data;
    },
    enabled: isFabricSelected
  });

  const assignFabric = useMutation({
    mutationKey: ['assign-fabric'],
    mutationFn: async (values: any) => {
      const res = await api.post('/FabricSupplierFabricColors', values);
      return res;
    },
    onSuccess: async (res) => {
      router.refresh();
      setOpen(false);
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & { fabricSupplierId?: string }
  ) => {
    delete values.fabric;
    values.fabricSupplierId = fabricSupplierId;
    assignFabric.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          {t('add_fabric')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('add_fabric')}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fabric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fabric')}</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_a_fabric')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {fabrics.data?.items?.map((fabric: any) => (
                          <SelectItem key={fabric.id} value={fabric.id}>
                            {fabric.name}
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
              name="fabricColorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('color')}</FormLabel>
                  <Select
                    disabled={!isFabricSelected}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_a_fabric_color')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {fabricDetails.data?.colors?.map((color: any) => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
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
              name="manufacturerCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('manifacturer_code')}</FormLabel>
                  <FormControl>
                    <Input placeholder="AS-YA01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              loading={assignFabric.isPending}
              className="w-full"
              type="submit"
            >
              {t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default AssignFabricSheet;
