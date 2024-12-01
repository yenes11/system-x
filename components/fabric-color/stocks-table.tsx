'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';

interface Props {
  data: any;
  fabricUnitName: string;
}

function StocksTable({ data, fabricUnitName }: Props) {
  const t = useTranslations();
  const stocksTableColumns = [
    {
      accessorKey: 'barcode',
      header: 'barcode'
    },
    {
      accessorKey: 'remainingAmount',
      header: 'remaining_amount',
      cell: ({ row }: { row: any }) => {
        return `${row.getValue('remainingAmount')} ${fabricUnitName}`;
      }
    }
  ];

  return (
    <Card className="overflow-hidden bg-nutural">
      <CardHeader className="flex-row items-center justify-between border-b bg-muted/50 px-4 py-3">
        <CardTitle>{t('stocks')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          bordered={false}
          searchKey=""
          data={data}
          columns={stocksTableColumns}
        />
      </CardContent>
    </Card>
  );
}

export default StocksTable;
