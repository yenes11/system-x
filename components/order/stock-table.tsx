'use client';

import api from '@/api';
import {
  BasicEntity,
  FabricOrder,
  MaterialOrder,
  OrderStock
} from '@/lib/types';
import { printBarcode } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Info, Package, Printer } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Fragment, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import AddStockSheet from './add-stock-sheet';
import StockDetailDialog from './stock-detail-dialog';
import Empty from '../ui/empty';

interface CollectionColor extends BasicEntity {
  identityDefined: boolean;
}

type Props =
  | {
      type: 'material';
      orderUnit: string;
      details: MaterialOrder;
    }
  | {
      type: 'fabric';
      orderUnit: string;
      details: FabricOrder;
    };

function StockTable({ orderUnit, details, type }: Props) {
  const t = useTranslations();
  const params = useParams();
  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });
  const [detailsState, setDetailsState] = useState({
    open: false,
    id: '',
    disabled: false
  });

  const [selectedRows, setSelectedRows] = useState<any>({});

  const colors = useQuery({
    queryKey: ['collection-colors', params.id],
    queryFn: async () => {
      const response = await api.get(`/FabricColorStocks/${params.id}`);
      return response.data?.items;
    }
  });

  const columns: ColumnDef<OrderStock>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row, table }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      )
    },
    {
      accessorKey: 'barcode',
      header: 'barcode'
    },
    {
      accessorKey: 'incomingAmount',
      header: 'incoming_amount'
    },
    {
      accessorKey: 'remainingAmount',
      header: 'remaining_amount'
    },
    {
      id: 'orderUnit',
      header: 'unit',
      cell: () => orderUnit
    },
    {
      accessorKey: 'returnStatus',
      header: 'return_status',
      cell: ({ row }) => {
        if (row.original.returnStatus) return t('returned');
        else if (row.original.remainingAmount === 0) return t('out_of_stock');
        return t('in_stock');
      }
    },
    {
      header: 'actions',
      enableHiding: false,
      meta: {
        style: { textAlign: 'right' },
        cellClassName: 'flex justify-end',
        headerClassName: 'flex justify-end'
      },
      cell: ({ row }) => {
        return (
          <Button
            onClick={() =>
              setDetailsState({
                open: true,
                id: row.original.id,
                disabled:
                  row.original.returnStatus ||
                  row.original.remainingAmount === 0
              })
            }
            variant="ghost"
            className="rounded-full"
            size="icon"
          >
            <Info className="size-4" />
          </Button>
        );
      }
    }
  ];

  const table = useReactTable({
    data: details.stocks || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setSelectedRows,
    enableRowSelection: true,
    state: {
      rowSelection: selectedRows
    }
  });

  const _selectedRows = table?.getSelectedRowModel?.()?.rows;

  const handlePrint = () => {
    let info: string;
    if (type === 'fabric') {
      info = `${details.fabric.name} - ${details.fabric.color} - ${details.fabric.unit}`;
    } else {
      info = `${details.material.name} - ${details.material.color} - ${details.material.orderUnit}`;
    }
    const date = moment(details.arrivalDate).format('DD/MM/YYYY');

    const labelData = _selectedRows.map((item) => ({
      barcode: item.original.barcode,
      info,
      amount: item.original.incomingAmount,
      date,
      supplier: details.supplier.name,
      supplierCode: details.supplier.manufacturerCode
    }));

    printBarcode(labelData);
  };

  return (
    <Fragment>
      <StockDetailDialog
        orderUnit={orderUnit}
        state={detailsState}
        setState={setDetailsState}
      />
      <Card className="overflow-hidden">
        <CardHeader className="h-12 flex-row items-center gap-2 border-b">
          <Package className="size-6" />
          <CardTitle>{t('stocks')}</CardTitle>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="ml-auto"
            disabled={_selectedRows.length === 0}
          >
            <Printer className="mr-2 size-4" />
            {t('print')}
          </Button>
          <AddStockSheet />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : typeof header.column.columnDef.header === 'string'
                          ? t(header.column.columnDef.header)
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Empty />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Fragment>
  );
}

export default StockTable;
