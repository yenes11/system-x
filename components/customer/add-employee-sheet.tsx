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
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  LucideUserRoundPlus,
  PlusIcon,
  User,
  UserPlus,
  UserRoundPlus,
  UserRoundPlusIcon
} from 'lucide-react';
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
import { EmployeeType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useCustomerDepartmentsSlice } from '@/store/customer-departments-slice';
import validator from 'validator';

const formSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().refine(validator.isMobilePhone),
  email: z.string().email(),
  customerEmployeeTypeId: z.string().uuid(),
  customerDepartmentId: z.string().uuid()
});

const defaultValues = {
  fullName: '',
  phone: '',
  email: '',
  customerEmployeeTypeId: ''
};

export function AddEmployeeSheet() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const selectedDepartmentId = useCustomerDepartmentsSlice(
    (state) => state.selectedDepartmentId
  );
  const selectedEmployees = useCustomerDepartmentsSlice(
    (state) => state.selectedEmployees
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      customerDepartmentId: selectedDepartmentId || ''
    }
  });

  const onOpenChange = (open: boolean) => {
    if (!selectedDepartmentId) {
      toast({
        title: t('warning'),
        description: t('select_department'),
        variant: 'default',
        // className: 'bg-orange-300'
        className: 'bg-destructive'
      });
      return;
    }

    if (open) {
      form.reset({
        ...defaultValues,
        customerDepartmentId: selectedDepartmentId || ''
      });
    }

    setOpen(open);
  };

  const employeeTypes = useQuery({
    queryKey: ['employee-types'],
    queryFn: async () => {
      const res = await api.get('/CustomerEmployeeTypes');
      return res.data;
    },
    enabled: open
  });

  const addEmployee = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/CustomerEmployees', data);
      return res.data;
    },
    onSuccess: (res) => {
      router.refresh();
      const employeeType = employeeTypes.data?.find(
        (employeeType: EmployeeType) =>
          employeeType.id === res.customerEmployeeTypeId
      );
      useCustomerDepartmentsSlice.setState((prev) => ({
        ...prev,
        selectedEmployees: [
          ...prev.selectedEmployees,
          {
            ...res,
            type: employeeType?.name
          }
        ]
      }));
      setOpen(false);
      toast({
        title: res.statusText,
        description: new Date().toString()
      });
    },
    onError: (error) => {
      // toast({
      //   title: error.response.data.title,
      //   description: error.response.data.detail,
      //   variant: 'destructive'
      // });
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addEmployee.mutate(values);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="rounded-full bg-nutural" variant="outline">
          <PlusIcon size={16} className="mr-2" />
          {t('add_employee')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <UserRoundPlus size={20} className="mr-2 text-muted-foreground" />
          <SheetTitle>{t('add_employee')}</SheetTitle>
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
            <Button
              loading={addEmployee.isPending}
              className="w-full"
              type="submit"
            >
              {addEmployee.isPending ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
