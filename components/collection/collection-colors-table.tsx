'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import {
  BadgeCheck,
  Check,
  Package,
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

interface CollectionColor extends BasicEntity {
  identityDefined: boolean;
}

function CollectionColorsTable() {
  const t = useTranslations();
  const params = useParams();
  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });

  const colors = useQuery({
    queryKey: ['collection-colors', params.id],
    queryFn: async () => {
      const response = await api.get(
        `/Collections/GetCollectionColors?PageSize=10&PageIndex=0&CollectionId=${params.id}`
      );
      return response.data?.items;
    }
  });

  const columns: ColumnDef<CollectionColor>[] = [
    {
      accessorKey: 'name',
      header: 'name',
      cell: ({ row }) => {
        return (
          <Link href={`/collection/manage-color/${row.original.id}`}>
            {row.original.name}
          </Link>
        );
      }
    },
    {
      accessorKey: 'identityDefined',
      header: 'identity_defined',
      cell: ({ row }) => {
        if (row.original.identityDefined) {
          return <BadgeCheck className="size-4 text-emerald-400" />;
        }
        return <XCircle className="size-4 text-destructive" />;
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
        );
      }
    }
  ];

  return (
    <Fragment>
      <ConfirmDeleteDialog
        endpoint="/CollectionColors"
        state={deleteState}
        setState={setDeleteState}
        title={t('delete_color')}
        submessage={t('delete_color_message')}
        mutationKey={['delete-collection-color', deleteState.id]}
      />
      <Card className="overflow-hidden">
        <CardHeader className="h-16 flex-row items-center gap-2 border-b">
          <SwatchBook className="size-6" />
          <CardTitle>{t('colors')}</CardTitle>
          <AddCollectionColorSheet />
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            bordered={false}
            searchKey=""
            data={colors.data || []}
            columns={columns}
          />
        </CardContent>
      </Card>
    </Fragment>
  );
}

export default CollectionColorsTable;
