'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import {
  BadgeCheck,
  Check,
  Package,
  SquarePen,
  SwatchBook,
  Trash2,
  XCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useParams } from 'next/navigation';
import { BasicEntity } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import AddCollectionColorSheet from './add-collection-color-sheet';
import { Button } from '../ui/button';
import { Fragment, useState } from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import Link from 'next/link';
import EditBarcodeSheet from './edit-barcode-sheet';
import AddBarcodeSheet from './add-barcode-sheet';

interface CollectionColor {
  id: string;
  sizeId: string;
  size: string;
  barcode: string;
}

function SizeAndBarcodeTable() {
  const t = useTranslations();
  const params = useParams();
  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });

  const [editState, setEditState] = useState({
    data: {
      id: '',
      barcode: ''
    },
    open: false
  });

  const sizes = useQuery({
    queryKey: ['collection-colors', params.id],
    queryFn: async () => {
      const response = await api.get(
        `/CollectionColorSizes?PageIndex=0&PageSize=10&CollectionColorId=${params.id}`
      );
      return response.data?.items;
    }
  });

  const columns: ColumnDef<CollectionColor>[] = [
    {
      accessorKey: 'size',
      header: 'body_size'
    },
    {
      accessorKey: 'barcode',
      header: 'barcode'
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
                  data: {
                    id: row.original.id,
                    barcode: row.original.barcode
                  },
                  open: true
                })
              }
              variant="ghost"
              className="rounded-full"
              size="icon"
            >
              <SquarePen className="size-4" />
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

  return (
    <Fragment>
      <EditBarcodeSheet setState={setEditState} state={editState} />
      <ConfirmDeleteDialog
        endpoint="/CollectionColorSizes"
        state={deleteState}
        setState={setDeleteState}
        title={t('delete_size')}
        mutationKey={['delete-collection-size', deleteState.id]}
      />
      <Card className="overflow-hidden">
        <CardHeader className="h-16 flex-row items-center gap-2 border-b text-lg">
          <SwatchBook className="size-6" />
          <CardTitle>{t('size_and_barcode')}</CardTitle>
          <AddBarcodeSheet />
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            bordered={false}
            searchKey=""
            data={sizes.data || []}
            columns={columns}
          />
        </CardContent>
      </Card>
    </Fragment>
  );
}

export default SizeAndBarcodeTable;
