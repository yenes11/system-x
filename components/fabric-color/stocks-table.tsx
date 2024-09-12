'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';

interface Props {
  data: any;
  fabricUnitName: string;
}

function StocksTable({ data, fabricUnitName }: Props) {
  const stocksTableColumns = [
    {
      accessorKey: 'barcode',
      header: 'Barcode'
    },
    {
      accessorKey: 'remainingAmount',
      header: 'Remaining Amount',
      cell: ({ row }: { row: any }) => {
        return `${row.getValue('remainingAmount')} ${fabricUnitName}`;
      }
    }
  ];

  return (
    <Card className="overflow-hidden bg-nutural">
      <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-3">
        <CardTitle>Stocks</CardTitle>
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
