'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';

type Fabric = {
  id: string;
  name: string;
  grammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
};

type Data = {
  items: Fabric[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

interface Props {
  data: any;
}

const suppliersTableColumns = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'manufacturerCode',
    header: 'Manufacturer code',
    cell: ({ row }: { row: any }) => (
      <Badge className="bg-muted text-black hover:bg-muted/80 dark:text-white">
        {row.getValue('manufacturerCode')}
      </Badge>
    )
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'authorizedPersonFullName',
    header: 'Authorized Person'
  }
];

function SuppliersTable({ data }: Props) {
  return (
    <Card className="overflow-hidden bg-nutural">
      <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-3">
        <CardTitle>Suppliers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable searchKey="" data={data} columns={suppliersTableColumns} />
      </CardContent>
    </Card>
  );
}

export default SuppliersTable;
