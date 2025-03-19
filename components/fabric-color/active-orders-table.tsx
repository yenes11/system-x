'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import { Badge } from '../ui/badge';
import { Currency, currencyEnums, Status, statusEnums } from '@/types';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  ShoppingBasket,
  ShoppingCart,
  SquarePen,
  Trash2
} from 'lucide-react';
import PlaceOrderSheet from '../place-order-sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import EditOrderSheet from './edit-order-sheet';
// import AddOrderSheet from './add-order-sheet';

const statusClasses = {
  1: 'bg-muted text-black hover:bg-muted/80',
  2: 'bg-blue-500 hover:bg-blue-500/80',
  3: 'bg-green-500 hover:bg-green-green/80'
};

function ActiveOrdersTable({ color }: { color: any }) {
  const t = useTranslations();
  const path = usePathname();
  const [editState, setEditState] = React.useState({
    open: false,
    data: undefined
  });
  const [deleteState, setDeleteState] = React.useState({
    open: false,
    id: ''
  });

  const type = path.startsWith('/fabric') ? '/fabric' : '/material';
  const propertyName = path.startsWith('/fabric')
    ? 'fabricColorOrderId'
    : 'materialColorVariantOrderId';
  const deleteURL = path.startsWith('/fabric')
    ? '/FabricColorOrders'
    : '/MaterialColorVariantOrders';

  const activeOrdersTableColumns = [
    {
      accessorKey: 'status',
      header: 'status',
      cell: ({ row }: { row: any }) => {
        const status = row.getValue('status') as Status;
        return (
          <Badge className={`${statusClasses[status]} text-nowrap`}>
            {statusEnums[status]}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'futureOrdersStock',
      header: 'future_orders_stock'
    },
    {
      accessorKey: 'estimatedArrivalDate',
      header: 'estimated_arrival_date',
      cell: ({ row }: { row: any }) => {
        const date = new Date(row.getValue('estimatedArrivalDate'));
        return date.toLocaleDateString();
      }
    },
    {
      accessorKey: 'unitPrice',
      header: 'price'
    },
    {
      accessorKey: 'currency',
      header: 'currency',
      cell: ({ row }: { row: any }) => (
        <Badge className="bg-emerald-600 px-4">
          {currencyEnums[row.getValue('currency') as Currency]}
        </Badge>
      )
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              className="flex items-center justify-center rounded-full"
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditState({
                  open: true,
                  data: row.original
                });
              }}
            >
              <SquarePen size={16} />
            </Button>
            <Button
              onClick={(e) => {
                setDeleteState({
                  open: true,
                  id: row.original.id
                });
              }}
              className="flex items-center justify-center rounded-full"
              variant="ghost"
              size="icon"
            >
              <Trash2 className="text-destructive" size={16} />
            </Button>
            <Link
              href={`${type}/order/${row.original[propertyName]}`}
              className=""
            >
              <Button
                className="flex items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
              >
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <ConfirmDeleteDialog
        endpoint={deleteURL}
        mutationKey={['delete-order', deleteState.id]}
        state={deleteState}
        setState={setDeleteState}
        title={t('delete_order')}
        submessage={t('delete_order_message')}
      />
      <EditOrderSheet state={editState} setState={setEditState} />
      <Card className="overflow-auto bg-nutural">
        <CardHeader className="h-12 flex-row items-center gap-2 border-b px-4 py-0">
          <ShoppingCart className="size-5" />
          <CardTitle>{t('active_orders')}</CardTitle>
          <PlaceOrderSheet />
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            bordered={false}
            searchKey=""
            data={color.activeOrders}
            columns={activeOrdersTableColumns}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default ActiveOrdersTable;
