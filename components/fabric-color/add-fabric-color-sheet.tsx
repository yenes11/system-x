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
import useIngredientsQuery from '@/hooks/queries/useIngredientsQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { toast } from 'sonner';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];
const MAX_FILE_SIZE = 5000000;

const formSchema = z.object({
  name: z.string().min(2).max(50),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
  ingredients: z.any()
  // IngredientId: z.string().uuid(),
  // IngredientPercentage: z.number().max(100)
});

interface Props {
  state: any;
  setState: any;
}

function AddFabricColorSheet({ state, setState }: Props) {
  const router = useRouter();
  const t = useTranslations();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: null,
      ingredients: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'ingredients',
    control: form.control
  });

  const totalIngredientsPercentage = form
    .watch('ingredients', fields)
    ?.reduce((acc: any, cur: any) => acc + cur.percentage, 0);

  const ingredients = useIngredientsQuery();

  const addFabricColor = useMutation({
    mutationKey: ['add-fabric'],
    mutationFn: async (formData: any) => {
      const res = await api.post('/FabricColors', formData);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({ id: '', open: false });
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
      form.reset();
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('FabricId', state.id);
    formData.append('Name', values.name);
    formData.append('Image', values.image);

    for (let [index, ingredient] of values.ingredients.entries()) {
      formData.append(`Ingredients[${index}].IngredientId`, ingredient.id);
      formData.append(
        `Ingredients[${index}].Percentage`,
        ingredient.percentage
      );
    }

    addFabricColor.mutate(formData);
  };

  return (
    <ThemedSheet
      title={t('add_fabric_color')}
      open={state.open}
      setOpen={(val: any) => setState((prev: any) => ({ ...prev, open: val }))}
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
                  <Input placeholder={t('blue')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>{t('image')}</FormLabel>
                <FormControl>
                  <Input
                    className="p-0"
                    type="file"
                    {...fieldProps}
                    accept="image/*"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((field, index) => (
            <div className="flex gap-2" key={field.id}>
              <FormField
                control={form.control}
                name={`ingredients.${index}.id` as any}
                render={({ field }) => (
                  <FormItem className="flex-[3]">
                    <FormLabel>{t('ingredient')}</FormLabel>
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('select_an_ingredient')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-48 overflow-scroll">
                        <SelectGroup>
                          {ingredients.data?.map((ingredient) => (
                            <SelectItem
                              key={ingredient.id}
                              value={ingredient.id}
                            >
                              {ingredient.name}
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
                name={`ingredients.${index}.percentage` as any}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('percentage')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="30"
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                onClick={() => remove(index)}
                variant="destructive"
                className="mt-auto"
              >
                <Icon icon="cross-circle" size={16} currentColor />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            className="w-full"
            variant="outline"
            disabled={totalIngredientsPercentage >= 100}
            onClick={() => append({ id: undefined, percentage: 0 })}
          >
            <Icon icon="plus" size={16} currentColor className="mr-2" />
            {t('add_ingredient')}
          </Button>
          <Button
            loading={addFabricColor.isPending}
            disabled={totalIngredientsPercentage !== 100}
            className="w-full"
            type="submit"
          >
            {addFabricColor.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </ThemedSheet>
  );
}

export default AddFabricColorSheet;
