'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import { Badge } from '../ui/badge';
import { Currency, currencyEnums, Status, statusEnums } from '@/types';

const statusClasses = {
  1: 'bg-muted text-black hover:bg-muted/80',
  2: 'bg-blue-500 hover:bg-blue-500/80',
  3: 'bg-green-500 hover:bg-green-green/80'
};

const activeOrdersTableColumns = [
  {
    accessorKey: 'status',
    header: 'Status',
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
    header: 'Future Orders Stock'
  },
  {
    accessorKey: 'estimatedArrivalDate',
    header: 'Estimated Arrival Date',
    cell: ({ row }: { row: any }) => {
      const date = new Date(row.getValue('estimatedArrivalDate'));
      return date.toLocaleDateString();
    }
  },
  {
    accessorKey: 'unitPrice',
    header: 'Price'
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-emerald-600 px-4">
        {currencyEnums[row.getValue('currency') as Currency]}
      </Badge>
    )
  }
];

function ActiveOrdersTable({ color }: { color: any }) {
  return (
    <Card className="overflow-auto bg-nutural">
      <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-3">
        <CardTitle>Active Orders</CardTitle>
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
