'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import { useTranslations } from 'next-intl';
import { Blocks } from 'lucide-react';

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
    header: 'name'
  },
  {
    accessorKey: 'manufacturerCode',
    header: 'manufacturer_code',
    cell: ({ row }: { row: any }) => (
      <Badge className="flex-nowrap bg-muted text-black hover:bg-muted/80 dark:text-white">
        {row.getValue('manufacturerCode')}
      </Badge>
    )
  },
  {
    accessorKey: 'phone',
    header: 'phone'
  },
  {
    accessorKey: 'authorizedPersonFullName',
    header: 'authorized_person'
  }
];

function SuppliersTable({ data }: Props) {
  const t = useTranslations();
  return (
    <Card className="overflow-hidden bg-nutural">
      <CardHeader className="h-12 flex-row items-center gap-2 border-b px-4">
        <Blocks />
        <CardTitle>{t('suppliers')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable searchKey="" data={data} columns={suppliersTableColumns} />
      </CardContent>
    </Card>
  );
}

export default SuppliersTable;
