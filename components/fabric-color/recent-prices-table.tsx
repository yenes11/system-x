'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import { Badge } from '../ui/badge';
import { Currency, currencyEnums, Status, statusEnums } from '@/types';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useTranslations } from 'next-intl';
import AddPriceSheet from './add-price-sheet';
import { Tag } from 'lucide-react';
import { usePathname } from 'next/navigation';

const recentPricesTableColumns = [
  {
    accessorKey: 'supplierName',
    header: 'supplier_name'
  },
  {
    accessorKey: 'manufacturerCode',
    header: 'manufacturer_code',
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-muted text-black hover:bg-muted/80 dark:text-white">
        {row.getValue('manufacturerCode')}
      </Badge>
    )
  },
  {
    accessorKey: 'createdDate',
    header: 'date',
    cell: ({ row }: { row: any }) => {
      return new Date(row.getValue('createdDate')).toLocaleDateString();
    }
  },
  {
    accessorKey: 'price',
    header: 'price'
  },
  {
    accessorKey: 'currency',
    header: 'currency',
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-emerald-600 hover:bg-emerald-600">
        {currencyEnums[row.getValue('currency') as Currency]}
      </Badge>
    )
  }
];

function RecentPricesTable({ id }: { id: string }) {
  const t = useTranslations();
  const path = usePathname();
  const isMaterial = path.startsWith('/material');
  const endpoint = isMaterial
    ? 'MaterialColorVariantPrices?Size=5&MaterialColorVariantId='
    : 'FabricColorPrices?Size=5&FabricColorId=';

  const { data } = useQuery({
    queryKey: ['recent-prices', id],
    queryFn: async () => {
      const res = await api.get(`${endpoint}${id}`);
      return res.data;
    }
  });

  return (
    <Card className="overflow-hidden bg-nutural">
      <CardHeader className="h-12 flex-row items-center justify-between border-b px-4 py-0">
        <div className="flex items-center gap-2">
          <Tag className="size-5" />
          <CardTitle>{t('recent_prices')}</CardTitle>
        </div>
        <AddPriceSheet />
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
