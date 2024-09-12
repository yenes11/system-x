'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import { Badge } from '../ui/badge';
import { Currency, currencyEnums, Status, statusEnums } from '@/types';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';

const recentPricesTableColumns = [
  {
    accessorKey: 'fabricSupplierName',
    header: 'Supplier Name'
  },
  {
    accessorKey: 'manufacturerCode',
    header: 'Manufacturer Code',
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-muted text-black hover:bg-muted/80 dark:text-white">
        {row.getValue('manufacturerCode')}
      </Badge>
    )
  },
  {
    accessorKey: 'createdDate',
    header: 'Date',
    cell: ({ row }: { row: any }) => {
      return new Date(row.getValue('createdDate')).toLocaleDateString();
    }
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-emerald-600 hover:bg-emerald-600">
        {currencyEnums[row.getValue('currency') as Currency]}
      </Badge>
    )
  }
];

function RecentPricesTable({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ['recent-prices', id],
    queryFn: async () => {
      const res = await api.get(`FabricColorPrices?Size=5&FabricColorId=${id}`);
      return res.data;
    }
  });

  return (
    <Card className="overflow-hidden bg-nutural">
      <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-3">
        <CardTitle>Recent Prices</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          bordered={false}
          searchKey=""
          data={data || []}
          columns={recentPricesTableColumns}
        />
      </CardContent>
    </Card>
  );
}

export default RecentPricesTable;
