import React, { useState } from 'react';
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
import ThemedDialog from '../themed-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../ui/chart';
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from 'recharts';
import moment from 'moment';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';

function RecentPricesDialog({ state, setState }: any) {
  const t = useTranslations();
  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });

  const recentPrices = useQuery({
    queryKey: ['recent-prices', state.fabricColorId],
    queryFn: async () => {
      const res = await api.get(
        `/FabricColorPrices/GetFabricPriceForSupplier?Size=20&FabricSupplierFabricColorId=${state.fabricColorId}`
      );
      return res.data;
    },
    enabled: !!state.fabricColorId
  });

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
      id: 'currency',
      header: 'currency',

      cell: ({ row }: { row: any }) => (
        <Badge className="rounded bg-emerald-700 py-0 hover:bg-emerald-600">
          {currencyEnums[row.original.currency as Currency]}
        </Badge>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex justify-end">
            <Button
              onClick={() =>
                setDeleteState({ open: true, id: row.original.id })
              }
              size="icon"
              className="-m-1.5 rounded-full"
              variant="ghost"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <ConfirmDeleteDialog
        endpoint="/FabricColorPrices"
        mutationKey={['delete-fabric-price', deleteState.id]}
        state={deleteState}
        setState={setDeleteState}
        title={t('delete_price')}
      />
      <ThemedDialog
        contentClassName="sm:max-w-2xl"
        open={state.open}
        setOpen={(open) => setState((prev: any) => ({ ...prev, open }))}
        title={t('recent_prices')}
      >
        <Tabs defaultValue="graph">
          <TabsList className="flex">
            <TabsTrigger className="flex-1" value="graph">
              {t('graph')}
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="table">
              {t('table')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            {recentPrices.data && (
              <DataTable
                bordered={true}
                rounded
                searchKey=""
                columns={recentPricesTableColumns}
                data={recentPrices.data}
              />
            )}
          </TabsContent>
          <TabsContent value="graph">
            <PricesGraph data={recentPrices.data} />
          </TabsContent>
        </Tabs>
      </ThemedDialog>
    </>
  );
}

export default RecentPricesDialog;

const chartConfig = {
  desktop: {
    label: '',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

const PricesGraph = ({ data }: any) => {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="createdDate"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => moment(value).format('DD.MM.YYYY')}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel></ChartTooltipContent>}
        />
        <Bar dataKey="price" fill="var(--color-desktop)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
};
