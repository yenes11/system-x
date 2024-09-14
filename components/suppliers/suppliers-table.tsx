'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getFabricSuppliers } from '@/lib/api-calls';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DataTable } from '../ui/data-table';
import EditSupplierSheet from './edit-supplier-sheet';
import { PaginatedData } from '@/lib/types';
import ThemedTooltip from '../ThemedTooltip';

type Fabric = {
  id: string;
  name: string;
  grammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
};

const getColumns = (setSupplierSheetState: any): ColumnDef<Fabric>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'name',
      cell: ({ row }) => {
        return (
          <Link href={`/fabric/supplier-management/${row.original.id}`}>
            {row.getValue('name')}
          </Link>
        );
      }
    },
    {
      accessorKey: 'address',
      header: 'address'
    },
    {
      accessorKey: 'phone',
      header: 'phone'
    },
    {
      accessorKey: 'authorizedPersonFullName',
      header: 'authorized_person'
    },
    {
      id: 'actions',
      enableHiding: false,
      header: '',
      cell: ({ row }) => {
        return (
          <div className="float-end flex gap-2">
            <ThemedTooltip text={'edit_supplier'}>
              <Button
                className="flex items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setSupplierSheetState({
                    data: row.original,
                    open: true
                  });
                }}
              >
                <Pencil size={16} />
              </Button>
            </ThemedTooltip>
          </div>
        );
      }
    }
  ] as ColumnDef<Fabric>[];
};

interface Props {
  data: PaginatedData<Fabric>;
}

function SuppliersTable() {
  const t = useTranslations();
  const [supplierSheetState, setSupplierSheetState] = useState({
    id: '',
    open: false
  });

  const fabricSuppliers = useQuery({
    queryKey: ['fabric-suppliers'],
    queryFn: () => getFabricSuppliers({ pageIndex: 0, pageSize: 10 })
  });

  const columns = useMemo(() => {
    return getColumns(setSupplierSheetState);
  }, []);

  return (
    <>
      <DataTable
        bordered
        rounded
        transparent={false}
        columns={columns}
        data={fabricSuppliers.data?.items || []}
        searchKey=""
      />
      <EditSupplierSheet
        setState={setSupplierSheetState}
        state={supplierSheetState}
      />
    </>
  );
}

export default SuppliersTable;
