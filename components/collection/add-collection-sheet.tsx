// 'use client';

// import { useTranslations } from 'next-intl';
// import ThemedSheet from '../themed-sheet';
// import Icon from '../ui/icon';
// import { useState } from 'react';
// import { z } from 'zod';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '../ui/form';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '../ui/input';
// import { useQuery } from '@tanstack/react-query';
// import { getCategories, getCustomers } from '@/lib/api-calls';
// import { getAllSubcategories } from '@/lib/utils';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Button } from '../ui/button';
// import { Plus } from 'lucide-react';

// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp'
// ];

// const formSchema = z.object({
//   customerId: z.string().uuid(),
//   customerDepartmentId: z.string().uuid(),
//   categoryId: z.string().uuid(),
//   customerSeasonId: z.string().uuid(),
//   sizeTypeId: z.string().uuid(),
//   name: z.string(),
//   description: z.string(),
//   image: z
//     .any()
//     .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
//     .refine(
//       (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
//       'Only .jpg, .jpeg, .png and .webp formats are supported.'
//     ),
//   customerCode: z.string(),
//   manufacturerCode: z.string(),
//   garment1: z.string(),
//   garment2: z.string(),
//   designer: z.string(),
//   buyer: z.string()
// });

// const defaultValues = {
//   customerId: '',
//   customerDepartmentId: '',
//   categoryId: '',
//   customerSeasonId: '',
//   sizeTypeId: '',
//   name: '',
//   description: '',
//   image: null,
//   customerCode: '',
//   manufacturerCode: '',
//   garment1: '',
//   garment2: '',
//   designer: '',
//   buyer: ''
// };

// function AddCollectionSheet() {
//   const [open, setOpen] = useState(false);
//   const t = useTranslations();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues
//   });

//   const categories = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//     select: getAllSubcategories
//   });

//   const customers = useQuery({
//     queryKey: ['customers'],
//     queryFn: () => getCustomers({ pageIndex: 0, pageSize: 99999 })
//   });

//   const onSubmit = (values: z.infer<typeof formSchema>) => {};

//   return (
//     <ThemedSheet
//       title={t('add_collection')}
//       triggerLabel={t('add_collection')}
//       triggerIcon={<Icon icon="plus" size={16} />}
//       open={open}
//       setOpen={setOpen}
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
//                   <Input
//                     placeholder={t('season_name_placeholder')}
//                     {...field}
//                   />
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
//                     className=""
//                     type="file"
//                     {...fieldProps}
//                     accept="image/*, application/pdf"
//                     onChange={(event) =>
//                       onChange(event.target.files && event.target.files[0])
//                     }
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {fields.map((field, index) => (
//             <div key={field.id}>
//               <FormField
//                 control={form.control}
//                 name={`ingredients.${index}.id` as any}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Ingredient</FormLabel>
//                     <Select
//                       {...field}
//                       onValueChange={(value) => {
//                         field.onChange(value);
//                       }}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select an ingredient" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent className="max-h-48 overflow-scroll">
//                         <SelectGroup>
//                           {ingredients.data?.map((ingredient) => (
//                             <SelectItem
//                               key={ingredient.id}
//                               value={ingredient.id}
//                             >
//                               {ingredient.name}
//                             </SelectItem>
//                           ))}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`ingredients.${index}.percentage` as any}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Percentage</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="30"
//                         type="number"
//                         onChange={(e) => {
//                           field.onChange(e.target.valueAsNumber);
//                         }}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           ))}
//           <Button
//             type="button"
//             className="w-full"
//             variant="outline"
//             disabled={totalIngredientsPercentage >= 100}
//             onClick={() => append({ id: undefined, percentage: 0 })}
//           >
//             <Plus size={12} className="mr-2" />
//             Add Ingredient
//           </Button>
//           <Button
//             loading={addFabricColor.isPending}
//             disabled={totalIngredientsPercentage !== 100}
//             className="w-full"
//             type="submit"
//           >
//             Submit
//           </Button>
//         </form>
//       </Form>
//     </ThemedSheet>
//   );
// }

// export default AddCollectionSheet;
