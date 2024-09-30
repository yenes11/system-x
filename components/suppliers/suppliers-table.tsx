'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PaginatedData, Supplier } from '@/lib/types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import ThemedTooltip from '../ThemedTooltip';
import { DataTable } from '../ui/data-table';
import EditSupplierSheet from './edit-supplier-sheet';

type Fabric = {
  id: string;
  name: string;
  grammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
};

const getColumns = (
  setSupplierSheetState: any,
  pathname: string
): ColumnDef<Supplier>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'name',
      cell: ({ row }) => {
        return (
          <Link href={`${pathname}/${row.original.id}`}>
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
  ] as ColumnDef<Supplier>[];
};

interface Props {
  data: PaginatedData<Supplier>;
}

function SuppliersTable({ data }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const [supplierSheetState, setSupplierSheetState] = useState({
    id: '',
    open: false
  });

  const columns = useMemo(() => {
    return getColumns(setSupplierSheetState, pathname);
  }, [pathname]);

  return (
    <>
      <DataTable
        bordered
        rounded
        transparent={false}
        columns={columns}
        data={data}
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
