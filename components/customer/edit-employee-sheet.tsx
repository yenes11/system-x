'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { UserCog } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Employee, EmployeeType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useCustomerDepartmentsSlice } from '@/store/customer-departments-slice';
import validator from 'validator';

const formSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  phone: z.string().refine(validator.isMobilePhone),
  email: z.string().email(),
  customerEmployeeTypeId: z.string().uuid(),
  customerDepartmentId: z.string().uuid()
});

const defaultValues = {
  id: '',
  fullName: '',
  phone: '',
  email: '',
  customerEmployeeTypeId: '',
  customerDepartmentId: ''
};

interface Props {
  state: {
    data: Employee | null;
    open: boolean;
  };
  setState: (state: { data: Employee | null; open: boolean }) => void;
}

export function EditEmployeeSheet({ state, setState }: Props) {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();

  const _defaultValues = state.data || defaultValues;

  const { editData } = useCustomerDepartmentsSlice();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: _defaultValues
  });

  const onOpenChange = (open: boolean) => {
    setState({ data: _defaultValues, open: open });
  };

  const employeeTypes = useQuery({
    queryKey: ['employee-types'],
    queryFn: async () => {
      const res = await api.get('/CustomerEmployeeTypes');
      return res.data;
    },
    enabled: state.open
  });

  useEffect(() => {
    if (state.open && employeeTypes.data) {
      const customerEmployeeType = employeeTypes.data.find((u: any) => {
        const item = state.data as any;
        return u.name === item.type;
      });
      form.reset({
        ..._defaultValues,
        customerEmployeeTypeId: customerEmployeeType?.id
      });
    }
  }, [state.data, employeeTypes.data]);

  const editEmployee = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await api.put('/CustomerEmployees', data);
      return res.data;
    },
    onSuccess: (res) => {
      router.refresh();
      setState({ data: null, open: false });
      toast({
        title: t('success'),
        description: t('employee_updated')
      });
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: t('unknown_error'),
        variant: 'destructive'
      });
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    editEmployee.mutate(values);
  }

  return (
    <Sheet open={state.open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <UserCog size={20} className="mr-2 text-muted-foreground" />
          <SheetTitle>{t('edit_employee')}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder="555 555 5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder="jane.doe@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerEmployeeTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employee_type')}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_employee_type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeeTypes.data?.map((employeeType: EmployeeType) => (
                        <SelectItem
                          key={employeeType.id}
                          value={employeeType.id}
                        >
                          {employeeType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {editEmployee.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
