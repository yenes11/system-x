'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import {
  BadgeCheck,
  Check,
  Package,
  PenSquare,
  ShoppingCart,
  SwatchBook,
  Trash2,
  XCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import {
  BasicEntity,
  CollectionColorOrder,
  DataState,
  OrderStatus
} from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import AddCollectionColorSheet from './add-collection-color-sheet';
import { Button } from '../ui/button';
import { Fragment, useState } from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import Link from 'next/link';
import ClientPagination from '../client-pagination';
import moment from 'moment';
import { SearchBar } from '../searchbar';
import ThemedSelect from '../themed-select';
import { useDebouncedCallback } from 'use-debounce';
import AddCollectionOrderSheet from './add-collection-order-sheet';
import EditCollectionOrderSheet from './edit-collection-order-sheet';
import { useCollectionSlice } from '@/store/collection-slice';

function CollectionColorOrdersTable() {
  const t = useTranslations();
  const params = useParams();
  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });
  const [editState, setEditState] = useState<DataState<CollectionColorOrder>>({
    open: false,
    data: null
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [status, setStatus] = useState('');
  const [plmId, setPlmId] = useState('');

  const collectionOrders = useQuery({
    queryKey: [
      'collection-color-orders',
      params.id,
      currentPage,
      status,
      plmId
    ],
    queryFn: async () => {
      let url = `/CollectionColorOrders/GetOrdersByCollectionColor/${params.id}?PageSize=10&PageIndex=${currentPage}`;
      if (status && status !== 'all') {
        url += `&Status=${status}`;
      }
      if (plmId) {
        url += `&PlmId=${plmId}`;
      }
      const response = await api.get(url);
      return response.data;
    }
  });

  const columns: ColumnDef<CollectionColorOrder>[] = [
    {
      id: 'plm',
      header: 'PlmId(GroupPlmId)',
      cell: ({ row }) => {
        if (!row.original.groupPlmId) {
          return row.original.plmId;
        }
        return `${row.original.plmId}(${row.original.groupPlmId})`;
      }
    },
    {
      accessorKey: 'amount',
      header: 'amount'
    },
    {
      id: 'status',
      header: 'status',
      cell: ({ row }) => {
        return t(OrderStatus[row.original.status]);
      }
    },
    {
      id: 'deadline',
      header: 'deadline',
      cell: ({ row }) => {
        return moment(row.original.deadline).format('LL');
      }
    },
    {
      header: 'actions',
      enableHiding: false,
      meta: {
        style: { textAlign: 'right' },
        cellClassName: 'flex justify-end',
        headerClassName: 'flex justify-end'
      },
      cell: ({ row }) => {
        return (
          <div>
            <Button
              onClick={() =>
                setEditState({
                  data: row.original,
                  open: true
                })
              }
              variant="ghost"
              className="rounded-full"
              size="icon"
            >
              <PenSquare className="size-4" />
            </Button>
            <Button
              onClick={() =>
                setDeleteState({
                  id: row.original.id,
                  open: true
                })
              }
              variant="ghost"
              className="rounded-full"
              size="icon"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        );
      }
    }
  ];

  const statusOptions = [
    {
      id: 'all',
      name: t('all')
    },
    {
      id: '1',
      name: t('new')
    },
    {
      id: '2',
      name: t('planning')
    },
    {
      id: '3',
      name: t('planned')
    },
    {
      id: '4',
      name: t('in_product_stations')
    },
    {
      id: '5',
      name: t('final_qc')
    },
    {
      id: '6',
      name: t('sent')
    },
    {
      id: '7',
      name: t('completed')
    }
  ];

  const handleSearch = useDebouncedCallback((plmId) => {
    setPlmId(plmId);
  }, 300);

  return (
    <Fragment>
      <ConfirmDeleteDialog
        endpoint="/CollectionColorOrders"
        state={deleteState}
        setState={setDeleteState}
        title={t('delete_order')}
        mutationKey={['delete-collection-color', deleteState.id]}
      />
      <EditCollectionOrderSheet state={editState} setState={setEditState} />
      <Card className="overflow-hidden">
        <CardHeader className="h-16 flex-row items-center gap-2 border-b">
          <ShoppingCart className="size-6" />
          <CardTitle>{t('orders')}</CardTitle>
          <AddCollectionOrderSheet />
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex gap-2 border-b p-2">
            <SearchBar
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t('plm_id')}
              className="max-w-64"
            />
            <ThemedSelect
              onClear={() => setStatus('')}
              value={status}
              onValueChange={(value) => setStatus(value)}
              options={statusOptions}
              placeholder={t('status')}
            />
          </div>
          <DataTable
            bordered={false}
            searchKey=""
            data={collectionOrders.data?.items || []}
            columns={columns}
          />
          <div className="border-t py-2">
            <ClientPagination
              setPage={setCurrentPage}
              currentPage={currentPage + 1}
              totalPages={collectionOrders.data?.pages}
            />
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
}

export default CollectionColorOrdersTable;
