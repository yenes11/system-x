'use client';

import React from 'react';
import { DataTable } from '../ui/data-table';
import { Link, Badge, Info, Pencil, Trash2, Banknote } from 'lucide-react';
import ThemedTooltip from '../ThemedTooltip';
import { Button } from '../ui/button';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useParams } from 'next/navigation';
import { CostItem } from '@/lib/types';
import { currencyEnums } from '@/types';
import CostDetailDialog from './cost-detail-dialog';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import DialogDemo from './test-dialog';
import AddCostDialog from './add-cost-dialog';

const getCustomersTableColumns = (
  setInfoState: any,
  setDeleteState: any,
  setEditState: any
) => [
  {
    accessorKey: 'name',
    header: 'name'
  },
  {
    accessorKey: 'type',
    header: 'type'
  },
  {
    header: 'total_cost',
    cell: ({ row }: { row: any }) => {
      const costs = row.original.details.reduce((acc: any, current: any) => {
        if (Object.hasOwn(acc, current.currency)) {
          acc[current.currency] += current.price;
        } else {
          acc[current.currency] = current.price;
        }
        return acc;
      }, {});
      let total: any = [];
      Object.keys(costs).forEach((key) => {
        total.push(
          `${costs[key]} ${
            currencyEnums[key as unknown as keyof typeof currencyEnums]
          }`
        );
      });
      return total.join(' + ');
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: { row: any }) => {
      return (
        <div className="float-end flex gap-2">
          <ThemedTooltip text={'customer_info'}>
            <Button
              className="flex items-center justify-center rounded-full"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                setInfoState({
                  open: true,
                  data: row.original
                });
              }}
            >
              <Info size={16} />
            </Button>
          </ThemedTooltip>
          <ThemedTooltip text={'edit_customer'}>
            <Button
              className="flex items-center justify-center rounded-full"
              variant="ghost"
              disabled
              size="icon"
              onClick={(e) => {
                setEditState({
                  open: true,
                  data: row.original
                });
              }}
            >
              <Pencil size={16} />
            </Button>
          </ThemedTooltip>
          <ThemedTooltip text={'delete_customer'}>
            <Button
              disabled
              onClick={(e) => {
                setDeleteState({
                  open: true,
                  id: row.original.id
                });
              }}
              className="flex items-center justify-center rounded-full"
              variant="ghost"
              size="icon"
            >
              <Trash2 size={16} />
            </Button>
          </ThemedTooltip>
        </div>
      );
    }
  }
];

function CostTable() {
  const t = useTranslations();
  const params = useParams();
  const [infoState, setInfoState] = React.useState({ open: false, data: null });
  const [deleteState, setDeleteState] = React.useState({
    open: false,
    id: null
  });
  const [editState, setEditState] = React.useState({ open: false, data: null });
  const costs = useQuery({
    queryKey: ['costs'],
    queryFn: async () => {
      const response = await api.get(
        `/CollectionColorCosts?PageIndex=0&PageSize=10&CollectionColorId=${params.id}`
      );
      return response.data;
    }
  });

  return (
    <React.Fragment>
      <CostDetailDialog
        setOpen={(val: boolean) =>
          setInfoState({
            ...infoState,
            open: val
          })
        }
        open={infoState.open}
        data={infoState.data}
      />
      <Card className="!overflow-hidden">
        <CardHeader className="flex h-16 flex-row items-center justify-end gap-2 border-b py-0">
          <Banknote className="size-6" />
          <CardTitle className="mr-auto text-lg">{t('costs')}</CardTitle>
          <AddCostDialog />
        </CardHeader>
        <CardContent className="p-0 @container">
          <DataTable
            columns={getCustomersTableColumns(
              setInfoState,
              setDeleteState,
              setEditState
            )}
            data={costs.data?.items || []}
            searchKey=""
            transparent
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default CostTable;
