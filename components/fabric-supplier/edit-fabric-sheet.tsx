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
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  manufacturerCode: z.string()
});

interface EditState {
  open: boolean;
  fabricColorId: string;
  manufacturerCode: string;
}

interface Props {
  state: EditState;
  setState: Dispatch<SetStateAction<EditState>>;
}

function EditFabricSheet({ state, setState }: Props) {
  const { toast } = useToast();
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const editFabric = useMutation({
    mutationKey: ['edit-fabric'],
    mutationFn: async (values: any) => {
      const res = await api.put('/FabricSupplierFabricColors', values);
      return res;
    },
    onSuccess: async (res) => {
      router.refresh();
      setState({
        open: false,
        fabricColorId: '',
        manufacturerCode: ''
      });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  useEffect(() => {
    form.reset({ manufacturerCode: state.manufacturerCode });
  }, [state.fabricColorId]);

  const onSubmit = (
    values: Partial<z.infer<typeof formSchema>> & {
      id?: string;
    }
  ) => {
    values.id = state.fabricColorId;
    // values.fabricSupplierId = state.fabricSupplierId;
    editFabric.mutate(values);
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
              name="manufacturerCode"
              defaultValue={state.manufacturerCode}
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
            <Button className="w-full" type="submit">
              {t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditFabricSheet;
