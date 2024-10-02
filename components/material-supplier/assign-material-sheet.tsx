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
import { useMemo, useState } from 'react';
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
import { getMaterialUrl } from '@/constants/api-constants';

const formSchema = z.object({
  material: z.string().uuid(),
  materialColorId: z.string().uuid(),
  manufacturerCode: z.string()
});

interface Props {
  materialSupplierId: string;
}

function AssignMaterialSheet() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const t = useTranslations();
  const router = useRouter();

  const params = useParams();
  const materialSupplierId = params.id as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  const isFabricSelected = !!form.watch('material');

  const materials = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const res = await api.get(
        getMaterialUrl({ pageIndex: 0, pageSize: 99999 })
      );
      return res.data;
    }
  });

  // const fabricDetails = useQuery({
  //   queryKey: ['fabric-details', form.watch('material')],
  //   queryFn: async () => {
  //     const res = await api.get(`/Materials/${form.watch('material')}`);
  //     return res.data;
  //   },
  //   enabled: isFabricSelected
  // });

  const fabricDetails = useMemo(() => {
    const selectedMaterial = materials.data?.items?.find(
      (m: any) => m.id === form.watch('material')
    );
    return selectedMaterial?.colors;
  }, [materials.data, form.watch('material')]);

  const assignMaterial = useMutation({
    mutationKey: ['assign-material'],
    mutationFn: async (values: any) => {
      const res = await api.post('/MaterialSupplierMaterialColors', values);
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
    values: Partial<z.infer<typeof formSchema>> & {
      materialSupplierId?: string;
    }
  ) => {
    delete values.material;
    values.materialSupplierId = materialSupplierId;
    assignMaterial.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
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
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('material')}</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_a_material')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {materials.data?.items?.map((material: any) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
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
              name="materialColorId"
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
                        <SelectValue
                          placeholder={t('select_a_material_color')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {fabricDetails?.map((color: any) => (
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
              loading={assignMaterial.isPending}
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

export default AssignMaterialSheet;
