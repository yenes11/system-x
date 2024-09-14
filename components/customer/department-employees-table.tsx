'use client';

import { ColumnDef, FilterFn } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getFabricSuppliers } from '@/lib/api-calls';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { DataTable } from '../ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCustomerDepartmentsSlice } from '@/store/customer-departments-slice';
import { AddEmployeeSheet } from './add-employee-sheet';
import { Employee } from '@/lib/types';
import { EditEmployeeSheet } from './edit-employee-sheet';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import { Badge } from '../ui/badge';
import ThemedTooltip from '../ThemedTooltip';

type Fabric = {
  id: string;
  name: string;
  grammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
};

const multiColumnFilterFn: FilterFn<Employee> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.fullName} ${row.original.type}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

const getColumns = (
  setEditState: any,
  setDeleteState: any
): ColumnDef<Employee>[] => {
  return [
    {
      accessorKey: 'fullName',
      header: 'name',
      filterFn: multiColumnFilterFn
    },
    {
      accessorKey: 'phone',
      header: 'phone'
    },
    {
      accessorKey: 'email',
      header: 'email'
    },
    {
      accessorKey: 'type',
      header: 'type',
      cell: ({ row }) => <Badge>{row.original.type}</Badge>
    },
    {
      id: 'actions',
      enableHiding: false,
      header: '',
      cell: ({ row }) => {
        return (
          <div className="float-end flex gap-2">
            <ThemedTooltip text={'edit_employee'}>
              <Button
                className="flex items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  setEditState({
                    data: row.original,
                    open: true
                  });
                }}
              >
                <Pencil size={16} />
              </Button>
            </ThemedTooltip>
            <ThemedTooltip text={'delete_employee'}>
              <Button
                className="flex items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  setDeleteState({
                    id: row.original.id,
                    open: true
                  });
                }}
              >
                <Trash2 className="text-destructive" size={16} />
              </Button>
            </ThemedTooltip>
          </div>
        );
      }
    }
  ] as ColumnDef<Employee>[];
};

function DepartmentEmployeesTable() {
  const t = useTranslations();
  const { selectedEmployees } = useCustomerDepartmentsSlice();
  const [supplierSheetState, setSupplierSheetState] = useState({
    id: '',
    open: false
  });

  const [editState, setEditState] = useState<{
    data: Employee | null;
    open: boolean;
  }>({
    data: null,
    open: false
  });

  const [deleteState, setDeleteState] = useState({
    open: false,
    id: ''
  });

  const columns = useMemo(() => {
    return getColumns(setEditState, setDeleteState);
  }, []);

  return (
    <React.Fragment>
      <EditEmployeeSheet state={editState} setState={setEditState} />
      <ConfirmDeleteDialog
        state={deleteState}
        setState={setDeleteState}
        endpoint="/CustomerEmployees"
        mutationKey={['delete-customer-employee']}
        title={t('delete_employee')}
      />
      <Card className="flex-[2] overflow-auto bg-nutural">
        <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-2">
          <CardTitle>{t('employees')}</CardTitle>
          <AddEmployeeSheet />
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            bordered={false}
            columns={columns}
            data={selectedEmployees || []}
            searchKey="fullName"
            inputClassName="m-2"
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default DepartmentEmployeesTable;
