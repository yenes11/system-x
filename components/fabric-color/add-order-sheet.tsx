// import React from 'react';
// import ThemedSheet from '../themed-sheet';
// import { useTranslations } from 'next-intl';
// import { Plus } from 'lucide-react';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from '../ui/button';
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
// import { Input } from '../ui/input';
// import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';

// const formSchema = z.object({
//   fabricColorId: z.string().uuid(),
//   orderAmount: z.number().min(1),
//   estimatedArrivalDate: z.string().min(1),
//   unitPrice: z.number().min(1),
//   currency: z.number().min(1)
// });

// function AddOrderSheet() {
//   const t = useTranslations();
//   const [open, setOpen] = React.useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema)
//   });

//   const onSubmit = (values: z.infer<typeof formSchema>) => {

//     };

//   return (
//     <ThemedSheet
//       open={open}
//       setOpen={setOpen}
//       title={t('place_order')}
//       triggerLabel={t('place_order')}
//       triggerIcon={<Plus className="mr-2 size-4" />}
//       triggerClassName="ml-auto"
//     >
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('name')}</FormLabel>
//                 <FormControl>
//                   <Input placeholder={t('blue')} {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="image"
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <FormItem>
//                 <FormLabel>{t('image')}</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="p-0"
//                     type="file"
//                     {...fieldProps}
//                     accept="image/*"
//                     onChange={(event) =>
//                       onChange(event.target.files && event.target.files[0])
//                     }
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//         <FormField
//             control={form.control}
//             name="fabricColorId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('customer')}</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue
//                         placeholder={t('select_customer_placeholder')}
//                       />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {customers.data?.map((customer) => (
//                       <SelectItem key={customer.id} value={customer.id}>
//                         {customer.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button
//             loading={addFabricColor.isPending}
//             disabled={totalIngredientsPercentage !== 100}
//             className="w-full"
//             type="submit"
//           >
//             {addFabricColor.isPending ? t('submitting') : t('submit')}
//           </Button>
//         </form>
//       </Form>
//     </ThemedSheet>
//   );
// }

// export default AddOrderSheet;
