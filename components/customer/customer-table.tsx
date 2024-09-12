'use client';

import {
  Currency,
  currencyEnums,
  CustomerType,
  customerTypeEnums
} from '@/types';
import { Badge } from '../ui/badge';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { Info, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import CustomerInfoDialog from './customer-info-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import { useTranslations } from 'next-intl';
import EditCustomerSheet from './edit-customer-sheet';
import Link from 'next/link';

const getCustomersTableColumns = (
  setInfoState: any,
  setDeleteState: any,
  setEditState: any
) => [
  {
    accessorKey: 'name',
    header: 'name',
    cell: ({ row }: { row: any }) => (
      <Link href={`/customer/management/${row.original.id}`}>
        {row.original.name}
      </Link>
    )
  },
  {
    accessorKey: 'address',
    header: 'address'
  },
  {
    accessorKey: 'country',
    header: 'country'
  },
  {
    accessorKey: 'type',
    header: 'type',
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-teal-600">
        {customerTypeEnums[row.getValue('type') as CustomerType]}
      </Badge>
    )
  },
  {
    accessorKey: 'currency',
    header: 'currency',
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-emerald-600">
        {currencyEnums[row.getValue('currency') as Currency]}
      </Badge>
    )
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: { row: any }) => {
      return (
        <div className="float-end flex gap-2">
          <Button
            className="flex items-center justify-center rounded-full"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              setInfoState({
                open: true,
                data: row.original
              });
            }}
          >
            <Info size={16} />
          </Button>
          <Button
            className="flex items-center justify-center rounded-full"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              setEditState({
                open: true,
                data: row.original
              });
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            onClick={(e) => {
              setDeleteState({
                open: true,
                id: row.original.id
              });
            }}
            className="flex items-center justify-center rounded-full"
            variant="ghost"
            size="icon"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    }
  }
];

function CustomerTable({ data }: { data: any }) {
  const t = useTranslations();
  const [infoState, setInfoState] = useState({
    open: false,
    data: null
  });
  const [deleteState, setDeletState] = useState({
    open: false,
    id: ''
  });
  const [editState, setEditState] = useState({
    open: false,
    data: null
  });

  console.log(editState, 'editstate');

  const columns = useMemo(() => {
    return getCustomersTableColumns(setInfoState, setDeletState, setEditState);
  }, []);

  return (
    <>
      <ConfirmDeleteDialog
        title={t('delete_customer')}
        endpoint="/Customers"
        mutationKey={['delete-customer']}
        state={deleteState}
        setState={setDeletState}
      />
      <EditCustomerSheet state={editState} setState={setEditState} />
      <CustomerInfoDialog state={infoState} setState={setInfoState} />
      <DataTable
        bordered
        rounded
        transparent={false}
        searchKey=""
        data={data}
        columns={columns}
      />
    </>
  );
}

export default CustomerTable;
