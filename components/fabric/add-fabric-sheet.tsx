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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import useFabricTypesQuery from '@/hooks/queries/useFabricTypesQuery';
import useFabricUnitsQuery from '@/hooks/queries/useFabricUnitsQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { getTodos } from '@/app/actions';
import { Origami } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  grammage: z.number().min(1),
  fabricUnitId: z.string().uuid(),
  fabricTypeId: z.string().uuid()
});

function AddFabricSheet() {
  const fabricTypes = useFabricTypesQuery();
  const fabricUnits = useFabricUnitsQuery();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const todos = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    enabled: open
  });

  console.log(todos.data, 'todos');

  const addFabric = useMutation({
    mutationKey: ['add-fabric'],
    mutationFn: async (values: any) => {
      const res = await api.post('/Fabrics', values);
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['fabrics']
      });
      setOpen(false);
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addFabric.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          Add New Fabric
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <Origami size={18} className="mr-2 text-muted-foreground" />
          <SheetTitle>Add new fabric</SheetTitle>
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
                  <FormLabel>Grammage</FormLabel>
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
                  <FormLabel>Fabric Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fabric type" />
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
                  <FormLabel>Fabric Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fabric unit" />
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
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
        {/* )} */}
      </SheetContent>
    </Sheet>
  );
}

export default AddFabricSheet;
