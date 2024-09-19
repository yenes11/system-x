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
import useIngredientsQuery from '@/hooks/queries/useIngredientsQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
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
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: null,
      ingredients: []
    }
  });

  const { fields, append } = useFieldArray({
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
      queryClient.invalidateQueries({
        queryKey: ['fabric-color', state.id]
      });
      setState({ id: '', open: false });
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
      form.reset();
    },
    onError: (e) => {}
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
    <Sheet
      open={state.open}
      onOpenChange={(val: any) =>
        setState((prev: any) => ({ ...prev, open: val }))
      }
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add new fabric color</SheetTitle>

          {/* <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription> */}
        </SheetHeader>

        {/* {fabricTypes.isLoading || fabricUnits.isLoading ? null : ( */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Blue" {...field} />
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
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      type="file"
                      {...fieldProps}
                      accept="image/*, application/pdf"
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
              <div key={field.id}>
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.id` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredient</FormLabel>
                      <Select
                        {...field}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an ingredient" />
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
                    <FormItem>
                      <FormLabel>Percentage</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="30"
                          type="number"
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              className="w-full"
              variant="outline"
              disabled={totalIngredientsPercentage >= 100}
              onClick={() => append({ id: undefined, percentage: 0 })}
            >
              <Plus size={12} className="mr-2" />
              Add Ingredient
            </Button>
            <Button
              loading={addFabricColor.isPending}
              disabled={totalIngredientsPercentage !== 100}
              className="w-full"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
        {/* )} */}
      </SheetContent>
    </Sheet>
  );
}

export default AddFabricColorSheet;
