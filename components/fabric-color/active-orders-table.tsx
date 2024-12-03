'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import { Badge } from '../ui/badge';
import { Currency, currencyEnums, Status, statusEnums } from '@/types';
import { useTranslations } from 'next-intl';
import { ShoppingBasket, ShoppingCart } from 'lucide-react';

const statusClasses = {
  1: 'bg-muted text-black hover:bg-muted/80',
  2: 'bg-blue-500 hover:bg-blue-500/80',
  3: 'bg-green-500 hover:bg-green-green/80'
};

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
  }
];

function ActiveOrdersTable({ color }: { color: any }) {
  const t = useTranslations();
  return (
    <Card className="overflow-auto bg-nutural">
      <CardHeader className="h-12 flex-row items-center gap-2 border-b px-4 py-0">
        <ShoppingCart className="size-5" />
        <CardTitle>{t('active_orders')}</CardTitle>
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
  );
}

export default ActiveOrdersTable;
