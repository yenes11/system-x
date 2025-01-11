import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { useTranslations } from 'next-intl';
import { DataTable } from '../ui/data-table';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Badge } from '../ui/badge';
import { Currency, currencyEnums } from '@/types';

const recentPricesTableColumns = [
  {
    accessorKey: 'price',
    header: 'price'
  },
  {
    accessorKey: 'createdDate',
    header: 'date',
    cell: ({ row }: { row: any }) => {
      return new Date(row.getValue('createdDate')).toLocaleDateString();
    }
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

function MaterialRecentPricesDialog({ state, setState }: any) {
  const t = useTranslations();
  console.log(state, 'material state');
  const recentPrices = useQuery({
    queryKey: ['material-recent-prices', state.materialColorId],
    queryFn: async () => {
      const res = await api.get(
        `/MaterialColorVariantPrices/GetMaterialPriceForSupplier?Size=20&MaterialSupplierMaterialColorId=${state.materialColorId}`
      );
      return res.data;
    },
    enabled: !!state.materialColorId
  });

  return (
    <Dialog
      open={state.open}
      onOpenChange={(val) => {
        setState((prev: any) => ({ ...prev, open: val }));
      }}
    >
      <DialogContent className="text-start">
        {recentPrices.data && (
          <DataTable
            bordered={false}
            searchKey=""
            columns={recentPricesTableColumns}
            data={recentPrices.data}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MaterialRecentPricesDialog;
