'use client';

import api from '@/api';
import { BodySize, DataState, IDState } from '@/lib/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Palette, SquarePen, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import { SearchBar } from '../searchbar';
import { Card, CardContent, CardHeader } from '../ui/card';
import { DataTable } from '../ui/data-table';
import EditBodySizeSheet from './edit-body-size-sheet';
import AddBodySizeSheet from './add-body-size-sheet';

function BodySizeManagementTable() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [query, setQuery] = React.useState('');
  const params = useParams();

  const [editState, setEditState] = React.useState<DataState<BodySize>>({
    data: null,
    open: false
  });
  const [deleteState, setDeleteState] = React.useState<IDState>({
    id: '',
    open: false
  });

  const sizes = useSuspenseQuery<BodySize[]>({
    queryKey: ['body-sizes', params.id],
    queryFn: async () => {
      const response = await api.get(
        `/CollectionColorOrderDetails/${params.id}`
      );
      return response.data;
    }
  });

  const columns: ColumnDef<BodySize>[] = [
    {
      accessorKey: 'size',
      header: 'body_size'
    },
    {
      accessorKey: 'barcode',
      header: 'barcode'
    },
    {
      accessorKey: 'amount',
      header: 'amount'
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
        title={t('delete_color')}
        endpoint="/CollectionColorOrderDetails"
        mutationKey={['delete-body-size', deleteState.id, 'body-sizes']}
        state={deleteState}
        setState={setDeleteState}
      />
      <EditBodySizeSheet state={editState} setState={setEditState} />
      <Card>
        <CardHeader className="flex-row items-center border-b py-4">
          <Palette className="mr-2 size-6" />
          {t('body_size_management')}
          <AddBodySizeSheet />
        </CardHeader>
        <CardContent className="p-0">
          <SearchBar
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
            className="m-2 max-w-64"
          />
          <DataTable data={sizes.data} columns={columns} searchKey="" />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default BodySizeManagementTable;
