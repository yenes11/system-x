'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../ui/data-table';
import { useTranslations } from 'next-intl';
import { Blocks, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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
    header: 'name',
    cell: ({ row }: { row: any }) => (
      <Link
        className="flex items-center hover:underline"
        target="_blank"
        href={`/supplier/${row.original.supplierId}`}
      >
        {row.original.name}
        <ExternalLink className="ml-1 size-4" />
      </Link>
    )
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
