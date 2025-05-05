import api from '@/api';
import { getFabricUrl } from '@/constants/api-constants';
import { getFabricsWithColors } from '@/lib/api-calls';
import { useCollectionSlice } from '@/store/collection-slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ThemedSheet from '../themed-sheet';
import ThemedTooltip from '../ThemedTooltip';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { toast } from '../ui/use-toast';
import SelectSearch from '../select-search';
import { Fabric, PaginatedData } from '@/lib/types';

const formSchema = z.object({
  fabric: z.string().uuid(),
  percentage: z.number().min(1).max(100),
  fabricColorId: z.string().uuid()
});

function AddFabricToCollectionSheet() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const verified = useCollectionSlice((state) => state.isVerified);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const fabricColors = useQuery({
    queryKey: ['fabric-colors'],
    queryFn: () => getFabricsWithColors({ pageIndex: 0, pageSize: 99999 }),
    select: (data) => data.items
  });

  const isFabricSelected = !!form.watch('fabric');

  const fabrics = useQuery<PaginatedData<Fabric>>({
    queryKey: ['fabrics'],
    queryFn: async () => {
      const res = await api.get(
        getFabricUrl({ pageIndex: 0, pageSize: 99999 })
      );
      return res.data;
    }
  });

  const fabricDetails = useQuery({
    queryKey: ['fabric-details', form.watch('fabric')],
    queryFn: async () => {
      const res = await api.get(`/Fabrics/${form.watch('fabric')}`);
      return res.data;
    },
    enabled: isFabricSelected
  });

  const assignFabricToCollection = useMutation({
    mutationFn: async (data: Partial<z.infer<typeof formSchema>>) => {
      const res = api.post('/CollectionColorFabrics', {
        fabricColorId: data.fabricColorId,
        collectionColorId: params?.id,
        percent: data.percentage
      });
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setOpen(false);
      form.reset();
      toast({
        title: t('item_added'),
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const onSubmit = async (values: Partial<z.infer<typeof formSchema>>) => {
    assignFabricToCollection.mutate(values);
  };

  return (
    <ThemedSheet
      open={open}
      setOpen={setOpen}
      title={t('add_fabric_to_collection')}
      trigger={
        <ThemedTooltip disabled={!verified} text="verification_required">
          <div>
            <Button
              disabled={verified}
              onClick={() => {
                setOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              {t('add_fabric_to_collection')}
            </Button>
          </div>
        </ThemedTooltip>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fabric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fabric')}</FormLabel>
                <SelectSearch
                  items={
                    fabrics.data?.items.map((i) => ({
                      label: i.name,
                      value: i.id
                    })) || []
                  }
                  value={field.value}
                  setValue={(value) => {
                    form.setValue('fabricColorId', '');
                    form.setValue('fabric', value);
                  }}
                />
                {/* <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue('fabricColorId', '');
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_a_fabric')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fabrics.data?.items?.map((fabric: any) => (
                      <SelectItem key={fabric.id} value={fabric.id}>
                        {fabric.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
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
                <SelectSearch
                  disabled={!isFabricSelected}
                  items={
                    fabricDetails.data?.colors.map((i: any) => ({
                      label: i.name,
                      value: i.id,
                      image: i.image
                    })) || []
                  }
                  value={field.value}
                  setValue={(value) => form.setValue('fabricColorId', value)}
                />
                {/* <Select
                  key={form.watch('fabric')}
                  disabled={!isFabricSelected}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-auto ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
                      <SelectValue placeholder={t('select_a_fabric_color')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                    {fabricDetails.data?.colors?.map((color: any) => (
                      <SelectItem key={color.id} value={color.id}>
                        <span className="flex items-center gap-2">
                          <img
                            className="size-14 rounded-sm"
                            src={color.image}
                            alt={color.name}
                          />
                          <span>
                            <span className="block font-medium">
                              {color.name}
                            </span>
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('percentage')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="25"
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
    </ThemedSheet>
  );
}

export default AddFabricToCollectionSheet;
