'use client';

import { Warehouse } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { DataTable } from '../ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DeleteWarehouseDialog } from '../fabric-supplier/delete-warehouse-dialog';
import AddWarehouseSheet from '../fabric-supplier/add-warehouse-sheet';
import EditWarehouseSheet from '../fabric-supplier/edit-warehouse-sheet';
import ConfirmDeleteDialog from '../confirm-delete-dialog';

interface Props {
  data: Warehouse[];
}

const getColumns = (
  setDeleteState: any,
  setEditState: any
): ColumnDef<Warehouse>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'name'
    },
    {
      accessorKey: 'address',
      header: 'address'
    },
    {
      accessorKey: 'supportFullName',
      header: 'support_name'
    },
    {
      accessorKey: 'supportPhone',
      header: 'support_phone'
    },
    {
      id: 'location',
      header: 'location',
      cell: ({ row }) => {
        const longitude = row.original.longitude;
        const latitude = row.original.latitude;
        const href = `https://www.google.com/maps?q=${longitude},${latitude}`;
        return (
          <a
            target="_blank"
            className="text-blue-600 underline"
            href={href}
            rel="noopener noreferrer"
          >
            Show on maps
          </a>
        );
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      header: '',
      // header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="float-end flex gap-2">
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
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteState({
                  id: row.original.id,
                  open: true
                });
              }}
              className="flex items-center justify-center rounded-full"
              variant="ghost"
              size="icon"
            >
              <Trash2 className="text-destructive" size={16} />
            </Button>
          </div>
        );
      }
    }
  ] as ColumnDef<Warehouse>[];
};

function WarehouseTable({ data }: Props) {
  const t = useTranslations();
  const [warehouseState, setWarehouseState] = useState({
    id: undefined,
    open: false
  });
  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });
  const [editState, setEditState] = useState({
    data: null,
    open: false
  });

  const columns = useMemo(() => {
    return getColumns(setDeleteState, setEditState);
  }, [data]);

  return (
    <>
      <EditWarehouseSheet state={editState} setState={setEditState} />
      <ConfirmDeleteDialog
        mutationKey={['delete-warehouse']}
        title={t('delete_warehouse')}
        state={deleteState}
        setState={setDeleteState}
        endpoint="/FabricSupplierWarehouses"
      />
      <Card className="flex-[2] overflow-auto bg-nutural">
        <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-2">
          <CardTitle>{t('warehouses')}</CardTitle>
          <AddWarehouseSheet />
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            bordered={false}
            searchKey=""
            data={data}
            columns={columns}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default WarehouseTable;
