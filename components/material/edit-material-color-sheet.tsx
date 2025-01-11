import React from 'react';
import ThemedSheet from '../themed-sheet';
import { BasicEntity } from '@/lib/types';
import { useTranslations } from 'next-intl';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import moment from 'moment';

const formSchema = z.object({
  name: z.string().min(2).max(50)
});

interface Props {
  state: any;
  setState: (state: any) => void;
}

function EditMaterialColorSheet({ state, setState }: Props) {
  const t = useTranslations();
  const router = useRouter();

  React.useEffect(() => {
    form.reset(state.data);
  }, [state.data]);

  const handleOpen = (open: any) => {
    setState((prev: any) => ({ ...prev, open }));
  };

  const editMaterialColor = useMutation({
    mutationFn: async (values: any) => {
      const res = await api.put('/MaterialColors', values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({
        data: undefined,
        open: false
      });
      toast.success(t('item_updated'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: state.data
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editMaterialColor.mutate({
      ...values,
      id: state.data.id
    });
  };

  return (
    <ThemedSheet
      open={state.open}
      title={t('edit_material_color')}
      setOpen={handleOpen}
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
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            loading={editMaterialColor.isPending}
            className="w-full"
            type="submit"
          >
            {editMaterialColor.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditMaterialColorSheet;
