import React from 'react';
import ThemedSheet from '../themed-sheet';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import moment from 'moment';

type State = {
  open: boolean;
  id: string;
  amount: number;
};

interface Props {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const formSchema = z.object({
  amount: z.number().min(1)
});

function EditCollectionMaterialSheet({ state, setState }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const editVariant = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put('/CollectionColorMaterials', {
        ...values,
        id: state.id
      });
      return response;
    },
    onSuccess: (res) => {
      router.refresh();
      setState((prev) => ({
        ...prev,
        open: false
      }));
      form.reset();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
    }
  });

  React.useEffect(() => {
    if (state.id) {
      form.reset({
        amount: state.amount
      });
    }
  }, [state]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    editVariant.mutate(values);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0
    }
  });

  return (
    <ThemedSheet
      open={state.open}
      setOpen={(value: boolean) =>
        setState((prev) => ({ ...prev, open: value }))
      }
      title={t('edit_material_variant')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('amount')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={editVariant.isPending}
          >
            {editVariant.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditCollectionMaterialSheet;
