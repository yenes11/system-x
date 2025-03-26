'use client';

import {
  Currency,
  currencyEnums,
  CustomerType,
  customerTypeEnums
} from '@/types';
import { Info, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useId,
  useMemo,
  useState
} from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DataTable } from '../ui/data-table';
import ThemedTooltip from '../ThemedTooltip';
import { FabricOrder, PaginatedData } from '@/lib/types';
import ImageZoom from '../image-zoom';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import Component from '../comp-170';
import { Label } from '../ui/label';
import EditOrderSheet from '../fabric-color/edit-order-sheet';

function FabricOrdersTable({ data }: { data: PaginatedData<FabricOrder> }) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const id = useId();

  const status = searchParams.get('status');
  const [selectedValue, setSelectedValue] = useState('1');

  const [infoState, setInfoState] = useState({
    open: false,
    data: null
  });
  const [deleteState, setDeletState] = useState({
    open: false,
    id: ''
  });
  const [editState, setEditState] = useState({
    open: false,
    data: null
  });

  const columns: ColumnDef<FabricOrder>[] = [
    {
      id: 'fabric_details',
      header: 'fabric_details',
      meta: {
        cellClassName: 'align-top'
      },
      cell: ({ row }) => (
        <div className="-ml-3 flex h-full w-full gap-4">
          <ImageZoom>
            <img
              src={row.original.fabric.image}
              alt={row.original.fabric.name}
              className="size-28 rounded"
            />
          </ImageZoom>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{t('name')}</span>
            <span>{row.original.fabric.name}</span>
            <span className="mt-2 text-xs text-muted-foreground">
              {t('color')}
            </span>
            <span>{row.original.fabric.color}</span>
            <span className="mt-2 text-xs text-muted-foreground">
              {t('grammage')}
            </span>
            <span>{row.original.fabric.grammage}</span>
          </div>
        </div>
      )
    },
    {
      id: 'supplier',
      header: 'supplier',
      meta: {
        cellClassName: 'align-top'
      },
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{t('name')}</span>
            <span>{row.original.supplier.name}</span>
            <span className="text-xs text-muted-foreground">{t('phone')}</span>
            <span>{row.original.supplier.phone}</span>
            <span className="text-xs text-muted-foreground">
              {t('authorized_person')}
            </span>
            <span>{row.original.supplier.authorizedPersonFullName}</span>
          </div>
        );
      }
    },
    {
      id: 'order_details',
      header: 'order_details',
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {t('order_placed_by')}
            </span>
            <span className="mb-2">{row.original.createdUser?.fullName}</span>
            <span className="text-xs text-muted-foreground">
              {t('order_amount')}
            </span>
            <span className="mb-2">
              {`${row.original.orderAmount} ${row.original.fabric.unit}`}{' '}
            </span>
            {status === '3' && (
              <>
                <span className="text-xs text-muted-foreground">
                  {t('incoming_amount')}
                </span>
                <span className="mb-2">
                  {`${row.original.incomingAmount} ${row.original.fabric.unit}`}
                </span>
              </>
            )}
            <span className="text-xs text-muted-foreground">
              {t('order_date')}
            </span>
            <span className="mb-2">
              {moment(row.original.orderPlacedDate).format('LL')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('estimated_arrival_date')}
            </span>
            <span className="mb-2">
              {moment(row.original.estimatedArrivalDate).format('LL')}
            </span>
            {status === '3' && (
              <>
                <span className="text-xs text-muted-foreground">
                  {t('arrival_date')}
                </span>
                <span className="mb-2">
                  {moment(row.original.arrivalDate).format('LL')}
                </span>
              </>
            )}
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      meta: {
        cellClassName: 'align-top'
      },
      cell: ({ row }: { row: any }) => {
        return (
          <div className="float-end -mr-3 flex flex-col gap-2">
            <Button
              className="flex items-center justify-center"
              variant="outline"
              size="sm"
              onClick={(e) => {
                router.push(`/fabric/order/${row.original.id}`);
              }}
            >
              {t('manage_order')}
            </Button>
            {(status === '1' || status === '2') && (
              <Button
                className="flex items-center justify-center"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  setEditState({
                    open: true,
                    data: row.original
                  });
                }}
              >
                {t('update_order')}
              </Button>
            )}
            {status === '1' && (
              <Button
                onClick={(e) => {
                  setDeletState({
                    open: true,
                    id: row.original.id
                  });
                }}
                className="flex items-center justify-center"
                variant="destructive"
                size="sm"
              >
                <Trash2 className="mr-2 size-4" />
                {t('delete_order')}
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  const items = [
    { value: '1', label: t('order_placed') },
    { value: '2', label: t('to_be_continue') },
    { value: '3', label: t('completed') }
  ];

  const onStatusChange = (event: any) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const value = event.currentTarget.value.trim();

    if (value) {
      current.set('status', event.currentTarget.value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  return (
    <>
      <ConfirmDeleteDialog
        title={t('delete_order')}
        endpoint="/FabricColorOrders"
        mutationKey={['delete-fabric-order']}
        state={deleteState}
        setState={setDeletState}
      />
      <EditOrderSheet state={editState} setState={setEditState} />
      <RadioGroup className="flex flex-wrap gap-2" defaultValue="1">
        {items.map((item) => (
          <div
            key={`${id}-${item.value}`}
            className="has-data-[state=checked]:border-ring shadow-xs relative flex flex-col items-start gap-4 rounded-md border border-input px-4 py-2 outline-none"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                onClick={onStatusChange}
                id={`${id}-${item.value}`}
                value={item.value}
                className="after:absolute after:inset-0"
              />
              <Label htmlFor={`${id}-${item.value}`}>{item.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>

      <DataTable
        bordered
        rounded
        transparent={false}
        searchKey=""
        data={data}
        columns={columns}
      />
    </>
  );
}

export default FabricOrdersTable;
