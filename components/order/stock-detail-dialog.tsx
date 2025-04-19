'use client';

import React, { Dispatch, SetStateAction, useRef } from 'react';
import ThemedDialog from '../themed-dialog';
import { useTranslations } from 'next-intl';
import { CollectionOrder, IDState, OrderStock } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import CheckboxCard from '../checkbox-card';
import { Button } from '../ui/button';
import { DataTable } from '../ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import ThemedTooltip from '../ThemedTooltip';
import JsBarcode from 'jsbarcode';
import { usePathname } from 'next/navigation';

const barcodeOptions: JsBarcode.Options = {
  format: 'CODE128', // Büyük harf ve sayı için uygun varsayılan format
  lineColor: '#000',
  width: 2,
  height: 100,
  displayValue: true, // Değeri barkod altında göster
  margin: 10 // Kenar boşluğu
};

interface Props {
  state: IDState & { disabled: boolean };
  setState: Dispatch<SetStateAction<IDState & { disabled: boolean }>>;
  orderUnit: string;
}

function StockDetailDialog({ state, setState, orderUnit }: Props) {
  const t = useTranslations();
  const pathname = usePathname();

  const url = pathname.startsWith('/fabric')
    ? `/FabricColorStocks/${state.id}`
    : `/MaterialColorVariantStocks/${state.id}`;

  const stockDetails = useQuery<OrderStock>({
    queryKey: ['stock-detail', state.id, url],
    queryFn: async () => {
      const response = await api.get(url);
      return response.data;
    }
  });

  const columns: ColumnDef<CollectionOrder>[] = [
    {
      id: 'image',
      header: 'image',
      cell: ({ row }) => {
        return (
          <img
            src={row.original.image}
            alt={row.original.name}
            className="h-8 w-8 rounded"
          />
        );
      }
    },
    {
      accessorKey: 'name',
      header: 'name'
    },
    {
      accessorKey: 'color',
      header: 'color'
    },
    {
      accessorKey: 'customerCode',
      header: 'customer_code'
    },
    {
      accessorKey: 'manufacturerCode',
      header: 'manufacturer_code'
    },
    {
      accessorKey: 'status',
      header: 'status',
      cell: ({ row }) => {
        return (
          <ThemedTooltip
            text={t('material_stock_dialog_message', {
              plmId: row.original.plmId,
              groupPlmId: row.original.groupPlmId,
              amount: stockDetails.data?.incomingAmount,
              unit: orderUnit
            })}
          >
            {row.original.status}
          </ThemedTooltip>
        );
      }
    }
  ];

  return (
    <ThemedDialog
      contentClassName="sm:max-w-3xl"
      title={t('stock_details')}
      open={state.open}
      setOpen={(val) => setState((prev: any) => ({ ...prev, open: val }))}
    >
      {stockDetails.data && (
        <div className="mb-4 flex flex-col gap-2">
          <ul className="divide-y">
            <li className="flex flex-col py-2">
              <span className="text-xs text-muted-foreground">
                {t('barcode')}
              </span>
              <span className="text-lg text-foreground">
                {stockDetails.data.barcode}
              </span>
            </li>
            <li className="flex flex-col py-2">
              <span className="text-xs text-muted-foreground">
                {t('incoming_amount')}
              </span>
              <span className="text-lg text-foreground">
                {stockDetails.data.incomingAmount?.toString()}
              </span>
            </li>
            <li className="flex flex-col py-2">
              <span className="text-xs text-muted-foreground">
                {t('remaining_amount')}
              </span>
              <span className="text-lg text-foreground">
                {stockDetails.data.remainingAmount?.toString()}
              </span>
            </li>
            <li className="flex flex-col py-2">
              <span className="text-xs text-muted-foreground">
                {t('status')}
              </span>
              <span className="text-lg text-foreground">
                {stockDetails.data.returnStatus
                  ? t('returned')
                  : stockDetails.data.remainingAmount === 0
                  ? t('out_of_stock')
                  : t('in_stock')}
              </span>
            </li>
          </ul>
        </div>
      )}

      <DataTable
        bordered
        data={stockDetails.data?.collectionOrders || []}
        columns={columns}
        searchKey=""
      />
    </ThemedDialog>
  );
}

export default StockDetailDialog;
