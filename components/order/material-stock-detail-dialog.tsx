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

function MaterialStockDetailDialog({ state, setState, orderUnit }: Props) {
  const t = useTranslations();
  const svgRef = useRef<SVGSVGElement>(null);

  const [checkedList, setCheckedList] = React.useState({
    barcode: false,
    incomingAmount: false,
    remainingAmount: false,
    status: false
  });

  const print = (barcode: string) => {
    // Ref'in bağlı olduğu SVG elementi mevcutsa ve barkod değeri varsa devam et
    if (svgRef.current && barcode) {
      // Sağlanan seçeneklerle varsayılan seçenekleri birleştir

      try {
        // JsBarcode'u çağırarak SVG elementine barkodu çizdir
        JsBarcode(svgRef.current, barcode, barcodeOptions);
        console.log('Barkod başarıyla oluşturuldu/güncellendi.');
      } catch (e) {
        // Hata durumunda konsola yazdır ve belki bir hata durumu yönetimi yap
        console.error('JsBarcode hatası:', e);
        // İsteğe bağlı: Kullanıcıya hata mesajı gösterebilirsiniz
        // Örneğin: svgRef.current.innerHTML = '<text fill="red">Hata!</text>';
      }
    }
  };

  const onCheckedChange = (key: keyof typeof checkedList) => {
    setCheckedList((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const printEnabled = Object.values(checkedList).some((val) => val);

  const stockDetails = useQuery<OrderStock>({
    queryKey: ['stock-detail', state.id],
    queryFn: async () => {
      const response = await api.get(`/MaterialColorVariantStocks/${state.id}`);
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
      contentClassName="sm:max-w-2xl"
      title={t('stock_details')}
      open={state.open}
      footer={
        <div>
          <Button
            disabled={state.disabled || !printEnabled}
            onClick={() => print('TESTCODE1234')}
            size="sm"
          >
            {t('print')}
          </Button>
        </div>
      }
      setOpen={(val) => setState((prev: any) => ({ ...prev, open: val }))}
    >
      {stockDetails.data && (
        <div className="mb-4 flex flex-col gap-2">
          <CheckboxCard
            title={t('barcode')}
            onCheckedChange={() => onCheckedChange('barcode')}
            description={stockDetails.data.barcode}
            checked={checkedList.barcode}
          />
          <CheckboxCard
            title={t('incoming_amount')}
            onCheckedChange={() => onCheckedChange('incomingAmount')}
            description={stockDetails.data.incomingAmount?.toString()}
            checked={checkedList.incomingAmount}
          />
          <CheckboxCard
            title={t('remaining_amount')}
            onCheckedChange={() => onCheckedChange('remainingAmount')}
            description={stockDetails.data.remainingAmount?.toString()}
            checked={checkedList.remainingAmount}
          />
          <CheckboxCard
            title={t('status')}
            onCheckedChange={() => onCheckedChange('status')}
            description={
              stockDetails.data.returnStatus
                ? t('returned')
                : stockDetails.data.remainingAmount === 0
                ? t('out_of_stock')
                : t('in_stock')
            }
            checked={checkedList.status}
          />
        </div>
      )}
      {/* <Button
        disabled={state.disabled || !printEnabled}
        onClick={() => print('TESTCODE1234')}
        size="sm"
      >
        {t('print')}
      </Button>
      <svg ref={svgRef}></svg> */}

      <DataTable
        bordered
        data={stockDetails.data?.collectionOrders || []}
        columns={columns}
        searchKey=""
      />
    </ThemedDialog>
  );
}

export default MaterialStockDetailDialog;
