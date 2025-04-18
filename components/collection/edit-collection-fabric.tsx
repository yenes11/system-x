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
  percent: number;
};

interface Props {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const formSchema = z.object({
  percent: z.number().min(1)
});

function EditCollectionFabricSheet({ state, setState }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const editColor = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put('/CollectionColorFabrics', {
        ...values,
        Id: state.id
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
        percent: state.percent
      });
    }
  }, [state]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    editColor.mutate(values);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      percent: 0
    }
  });

  return (
    <ThemedSheet
      open={state.open}
      setOpen={(value: boolean) =>
        setState((prev) => ({ ...prev, open: value }))
      }
      title={t('edit_fabric_color')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="percent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('percentage')}</FormLabel>
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
            disabled={editColor.isPending}
          >
            {editColor.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default EditCollectionFabricSheet;
