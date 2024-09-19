'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTranslations } from 'next-intl';
import { AddDepartmentSheet } from './add-department-sheet';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import Tree from '../tree';
import { Department } from '@/lib/types';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import { useCustomerDepartmentsSlice } from '@/store/customer-departments-slice';
import { EditDepartmentSheet } from './edit-department-sheet';
import { useEffect } from 'react';

function DepartmentTree({ data }: { data: Department[] }) {
  const t = useTranslations();
  const setDeleteDialog = useCustomerDepartmentsSlice(
    (state) => state.setDeleteDialog
  );

  const deleteId = useCustomerDepartmentsSlice((state) => state.deleteId);
  const isDeleteDialogOpen = useCustomerDepartmentsSlice(
    (state) => state.isDeleteDialogOpen
  );
  const setIsAddSheetOpen = useCustomerDepartmentsSlice(
    (state) => state.setIsAddSheetOpen
  );
  const selectDepartment = useCustomerDepartmentsSlice(
    (state) => state.selectDepartment
  );

  // useEffect(() => {
  //   if (data) {
  //     selectDepartment(data?.[0]?.employees, data?.[0]?.id);
  //   }
  // }, []);

  return (
    <>
      <AddDepartmentSheet />
      <EditDepartmentSheet />
      <ConfirmDeleteDialog
        state={{
          id: deleteId,
          open: isDeleteDialogOpen
        }}
        setState={setDeleteDialog}
        mutationKey={['delete-customer-department']}
        endpoint="/CustomerDepartments"
        title={t('delete_department')}
      />
      <Card className="flex-1 overflow-auto bg-nutural">
        <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-2">
          <CardTitle>{t('departments')}</CardTitle>
          <Button
            className="rounded-full bg-nutural"
            variant="outline"
            onClick={() => setIsAddSheetOpen(true, null)}
          >
            <PlusIcon size={16} className="mr-2" />
            {t('add_department')}
          </Button>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <Tree data={data} />
        </CardContent>
      </Card>
    </>
  );
}

export default DepartmentTree;
