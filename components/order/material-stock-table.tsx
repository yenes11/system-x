'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import {
  BadgeCheck,
  Check,
  Info,
  Package,
  SwatchBook,
  Trash2,
  XCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useParams } from 'next/navigation';
import { BasicEntity, OrderStock } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Fragment, useState } from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import Link from 'next/link';
import { Currency } from '@/types';

interface CollectionColor extends BasicEntity {
  identityDefined: boolean;
}

interface Props {
  data: OrderStock[];
  orderUnit: string;
  supplierName: string;
}

function MaterialStockTable({ data, orderUnit, supplierName }: Props) {
  const t = useTranslations();
  const params = useParams();
  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });

  const colors = useQuery({
    queryKey: ['collection-colors', params.id],
    queryFn: async () => {
      const response = await api.get(`/FabricColorStocks/${params.id}`);
      return response.data?.items;
    }
  });

  console.log(data, 'sss');

  const columns: ColumnDef<OrderStock>[] = [
    {
      accessorKey: 'barcode',
      header: 'barcode'
    },
    {
      accessorKey: 'incomingAmount',
      header: 'incoming_amount'
    },
    {
      accessorKey: 'remainingAmount',
      header: 'remaining_amount'
    },
    {
      id: 'orderUnit',
      header: 'unit',
      cell: () => orderUnit
    },
    {
      accessorKey: 'returnStatus',
      header: 'return_status',
      cell: ({ row }) => {
        if (row.original.returnStatus) return t('returned');
        else if (row.original.remainingAmount === 0) return t('out_of_stock');
        return t('in_stock');
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
            <Info className="size-4" />
          </Button>
        );
      }
    }
  ];

  return (
    <Fragment>
      <Card className="overflow-hidden">
        <CardHeader className="h-12 flex-row items-center gap-2 border-b">
          <Package className="size-6" />
          <CardTitle>{t('stocks')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            emptyDescription={t('material_stock_table_empty_message', {
              name: `"${supplierName}"`
            })}
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

export default MaterialStockTable;
