'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  ChevronLeft,
  ChevronRight,
  MapPinHouse,
  Palette,
  SquarePen,
  Trash2
} from 'lucide-react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import api from '@/api';
import {
  Color,
  DataState,
  IDState,
  PaginatedData,
  ProductStationAddress
} from '@/lib/types';
import moment from 'moment';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import React from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import EditColorSheet from './edit-color-sheet';
import { SearchBar } from '../searchbar';
import ClientPagination from '../client-pagination';
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '../ui/pagination';
import AddColorSheet from './add-color.sheet';
import { Separator } from '../ui/separator';
import AddProductionStationAddressSheet from './add-production-station-address-sheet';
import EditProductionStationAddressSheet from './edit-production-station-address-sheet';

function ProductStationAddressTable() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [query, setQuery] = React.useState('');
  const [searchParams, setSearchParams] = React.useState({
    pageIndex: 0,
    pageSize: 10,
    productStationId: '',
    name: ''
  });

  const [editState, setEditState] = React.useState<
    DataState<ProductStationAddress>
  >({
    data: null,
    open: false
  });
  const [deleteState, setDeleteState] = React.useState<IDState>({
    id: '',
    open: false
  });

  const productStationAddresses = useQuery<PaginatedData<any>>({
    queryKey: ['addresses-settings', searchParams],
    queryFn: async () => {
      const { pageSize, pageIndex, productStationId, name } = searchParams;
      const response = await api.get('/ProductStationAddresses', {
        params: {
          PageSize: pageSize,
          PageIndex: pageIndex,
          ProductStationId: productStationId,
          Name: name
        }
      });
      return response.data;
    }
  });

  const columns: ColumnDef<ProductStationAddress>[] = [
    {
      accessorKey: 'name',
      header: 'name'
    },
    {
      header: 'production_station',
      cell: ({ row }) => row.original.productionStation.name
    },
    {
      header: 'phone',
      accessorKey: 'phone'
    },
    {
      header: 'address',
      accessorKey: 'address'
    },
    {
      header: 'billing_address',
      accessorKey: 'billingAddress'
    },
    {
      header: 'authorized_person',
      accessorKey: 'authorizedPersonFullName'
    },

    {
      header: 'actions',
      meta: {
        cellClassName: 'float-right',
        headerClassName: 'text-right'
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <SquarePen
              onClick={() => {
                setEditState({
                  data: row.original,
                  open: true
                });
              }}
              role="button"
              className="size-8 rounded-full p-2 hover:bg-muted"
            />
            <Trash2
              onClick={() => {
                setDeleteState({
                  id: row.original.id,
                  open: true
                });
              }}
              role="button"
              className="size-8 rounded-full p-2 text-destructive hover:bg-muted"
            />
          </div>
        );
      }
    }
  ];

  return (
    <React.Fragment>
      <ConfirmDeleteDialog
        title={t('delete_address')}
        endpoint="/ProductStationAddresses"
        mutationKey={[
          'delete-settings-address',
          'addresses-settings',
          deleteState.id
        ]}
        state={deleteState}
        setState={setDeleteState}
      />
      <EditProductionStationAddressSheet
        state={editState}
        setState={setEditState}
      />
      <Card>
        <CardHeader className="flex-row items-center border-b py-4">
          <MapPinHouse className="mr-2 size-6" />
          {t('product_station_address_management')}
          <AddProductionStationAddressSheet />
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <SearchBar
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder={t('search')}
            className="m-2 max-w-64"
          />
          <DataTable
            data={productStationAddresses.data?.items || []}
            columns={columns}
            searchKey=""
          />
          <Separator className="mb-2" />
          <ClientPagination
            currentPage={searchParams.pageIndex}
            totalPages={productStationAddresses.data?.pages || 0}
            setPage={(value: number) => {
              setSearchParams((prev) => ({ ...prev, pageIndex: value }));
            }}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default ProductStationAddressTable;
