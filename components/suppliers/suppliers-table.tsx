'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil, SquarePen, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PaginatedData, Supplier } from '@/lib/types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import ThemedTooltip from '../ThemedTooltip';
import { DataTable } from '../ui/data-table';
import EditSupplierSheet from './edit-supplier-sheet';
import ThemedSelect from '../themed-select';
import { SearchBar } from '../searchbar';
import { useDebouncedCallback } from 'use-debounce';
import ConfirmDeleteDialog from '../confirm-delete-dialog';

type Fabric = {
  id: string;
  name: string;
  grammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
};

const getColumns = (
  setSupplierSheetState: any,
  pathname: string,
  setDeleteState: any
): ColumnDef<Supplier>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'name',
      cell: ({ row }) => {
        return (
          <Link
            title={row.original.name}
            href={`${pathname}/${row.original.id}`}
          >
            {row.getValue('name')}
          </Link>
        );
      },
      meta: {
        // headerClassName: 'w-48',
        // cellClassName: 'max-w-44 overflow-hidden text-ellipsis text-nowrap'
      }
    },
    {
      accessorKey: 'address',
      header: 'address',
      meta: {
        // cellClassName: 'max-w-56 overflow-hidden text-ellipsis text-nowrap'
      },
      cell: ({ row }) => {
        return <span title={row.original.address}>{row.original.address}</span>;
      }
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
            <ThemedTooltip text={'edit'}>
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
                <SquarePen size={16} />
              </Button>
            </ThemedTooltip>
            <ThemedTooltip text={'delete'}>
              <Button
                className="flex items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
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
  ] as ColumnDef<Supplier>[];
};

interface Props {
  data: PaginatedData<Supplier>;
}

function SuppliersTable({ data }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [supplierSheetState, setSupplierSheetState] = useState({
    id: '',
    open: false
  });

  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });

  const handleNameSearch = useDebouncedCallback((name) => {
    const newSearchParams = getNewSearchParams('name', name);
    router.replace(newSearchParams);
  }, 300);

  const getNewSearchParams = (key: string, value: string) => {
    let filteredUrl = `${pathname}`;
    const params = new URLSearchParams(searchParams);

    if (value.trim() === '') {
      // Remove the key from the params if the value is empty
      params.delete(key);
    } else {
      // Update or set the key in the params
      params.set(key, value);
    }

    // Construct the URL with the updated search parameters
    filteredUrl += params.toString() ? `?${params.toString()}` : '';

    return filteredUrl;
  };

  const columns = useMemo(() => {
    return getColumns(setSupplierSheetState, pathname, setDeleteState);
  }, [pathname]);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <SearchBar
          onChange={(e) => handleNameSearch(e.target.value)}
          className="w-64"
          placeholder={t('search')}
        />
      </div>
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

      <ConfirmDeleteDialog
        endpoint="/Suppliers"
        submessage={t('delete_supplier_warning')}
        mutationKey={['delete-supplier', deleteState.id]}
        state={deleteState}
        setState={setDeleteState}
        title={t('delete_supplier')}
      />
    </>
  );
}

export default SuppliersTable;
