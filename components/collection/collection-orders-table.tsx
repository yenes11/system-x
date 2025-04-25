'use client';

import AddFabricColorSheet from '@/components/fabric-color/add-fabric-color-sheet';
import EditFabricSheet from '@/components/fabric/edit-fabric-sheet';
import ServerPagination from '@/components/server-pagination';
import ThemedTooltip from '@/components/ThemedTooltip';
import { Button } from '@/components/ui/button';
import Empty from '@/components/ui/empty';
import Icon from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getCategories, getCustomers } from '@/lib/api-calls';
import {
  CollectionColorOrder,
  CollectionPingColor,
  CollectionStatus,
  Fabric,
  OrderStatus,
  PaginatedData
} from '@/lib/types';
import { getAllSubcategories } from '@/lib/utils';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { SearchBar } from '../searchbar';
import ThemedSelect from '../themed-select';
import ThemedZoom from '../themed-zoom';
import { Badge } from '../ui/badge';
import { Gallery, Item } from 'react-photoswipe-gallery';
import Image from 'next/image';
import ImageZoom from '../image-zoom';
import Link from 'next/link';
import moment from 'moment';

const getColumns = (
  setColorState: any,
  setEditFabricState: any
): ColumnDef<CollectionColorOrder>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'name'
    },
    {
      accessorKey: 'grammage',
      header: 'grammage'
    },
    {
      accessorKey: 'fabricUnitName',
      header: 'unit'
    },
    {
      accessorKey: 'image',
      header: 'image'
    },
    {
      accessorKey: 'fabricTypeName',
      header: 'fabric_type'
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'actions',
      meta: {
        style: {
          textAlign: 'end'
        }
      },
      cell: ({ row }) => {
        return (
          <div className="float-end flex gap-2">
            <ThemedTooltip text="edit_fabric">
              <Button
                className="flex items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditFabricState({
                    data: row.original,
                    open: true
                  });
                }}
              >
                <Icon currentColor icon="feather" size={16} />
              </Button>
            </ThemedTooltip>
            <ThemedTooltip text="add_color_to_fabric">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setColorState({
                    id: row.original.id,
                    open: true
                  });
                }}
                className="flex items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
              >
                <Icon currentColor icon="plus" size={16} />
              </Button>
            </ThemedTooltip>
          </div>
        );
      }
    }
  ] as ColumnDef<CollectionColorOrder>[];
};

interface Props {
  data: PaginatedData<CollectionColorOrder>;
}

function CollectionOrdersTable({ data }: Props) {
  const t = useTranslations();
  const [fabricColorState, setFabricColorState] = useState({
    id: '',
    open: false
  });
  const [editFabricState, setEditFabricState] = useState({
    data: null,
    open: false
  });

  console.log(data, 'dddddd');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allOption = {
    id: 'all',
    name: t('all')
  };

  const customers = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers({ pageIndex: 0, pageSize: 99999 })
  });

  const customersOptions = customers.data
    ? [allOption, ...customers.data.items]
    : [];

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    select: getAllSubcategories
  });

  const categoriesOptions = categories.data
    ? [allOption, ...categories.data]
    : [];

  const columns = useMemo(() => {
    return getColumns(setFabricColorState, setEditFabricState);
  }, []);

  const handleCustomerCodeSearch = useDebouncedCallback((customerCode) => {
    const newSearchParams = getNewSearchParams('customerCode', customerCode);
    router.replace(newSearchParams);
  }, 300);

  const handlePlmIdSearch = useDebouncedCallback((customerCode) => {
    const newSearchParams = getNewSearchParams('plmId', customerCode);
    router.replace(newSearchParams);
  }, 300);

  const handleGroupPlmIdSearch = useDebouncedCallback((customerCode) => {
    const newSearchParams = getNewSearchParams('groupPlmId', customerCode);
    router.replace(newSearchParams);
  }, 300);

  const clearSearchParam = (key: string) => {
    let clearedSearchParams = searchParams.toString();
    const value = searchParams.get(key);
    if (value) {
      clearedSearchParams = clearedSearchParams.replace(`&${key}=${value}`, '');
      clearedSearchParams = clearedSearchParams.replace(`${key}=${value}`, '');
    }
    router.replace(`${pathname}?${clearedSearchParams}`);
  };

  const handleSearchParams = (key: string, value: string) => {
    router.replace(getNewSearchParams(key, value));
  };

  const getNewSearchParams = (key: string, value: string) => {
    let filteredUrl = `${pathname}`;
    const plmId = searchParams.get('plmId');
    const groupPlmId = searchParams.get('groupPlmId');
    const status = searchParams.get('status');
    const customerCode = searchParams.get('customerCode');

    // Construct the updated query parameters based on conditions
    const params = new URLSearchParams();

    if (key !== 'plmId' && plmId) {
      params.set('plmId', plmId);
    }
    if (key !== 'groupPlmId' && groupPlmId) {
      params.set('groupPlmId', groupPlmId);
    }
    if (key !== 'status' && status) {
      params.set('status', status);
    }
    if (key !== 'customerCode' && customerCode) {
      params.set('customerCode', customerCode);
    }

    // Special condition handling
    if (
      value.toLowerCase() !== 'all' &&
      !(key === 'customerCode' && value === '')
    ) {
      params.set(key, value);
    } else if (key === 'customerCode' && value === '') {
      params.delete('customerCode');
    }

    // Append updated search parameters to the URL
    if (Array.from(params).length > 0) {
      filteredUrl += `?${params.toString()}`;
    }

    return filteredUrl;
  };

  const collectionOptions = Object.entries(CollectionStatus).map(
    ([key, value]) => ({
      id: key,
      name: t(value)
    })
  );

  const table = useReactTable({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <SearchBar
          onChange={(e) => handleCustomerCodeSearch(e.target.value)}
          className="w-64"
          placeholder={t('customer_code')}
        />
        <SearchBar
          onChange={(e) => handlePlmIdSearch(e.target.value)}
          className="w-64"
          placeholder={t('plm_id')}
        />
        <SearchBar
          onChange={(e) => handleGroupPlmIdSearch(e.target.value)}
          className="w-64"
          placeholder={t('group_plm_id')}
        />

        <ThemedSelect
          onClear={() => clearSearchParam('status')}
          value={searchParams.get('status') || ''}
          onValueChange={(value) => handleSearchParams('status', value)}
          options={[allOption, ...collectionOptions]}
          placeholder={t('status')}
        />
      </div>
      <Table transparent={false} rounded>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-4 py-4" colSpan={columns.length}>
                  <div className="flex">
                    <div className="mr-2 flex-1 pr-2">
                      <ImageZoom>
                        {/* <Image
                          width={128}
                          height={128}
                          className="mr-2 aspect-square w-32 min-w-32 origin-top-left rounded object-cover object-top"
                          src={row.original.image}
                          alt={row.original.name}
                        /> */}
                        <img
                          className="aspect-square w-32 min-w-32 origin-top-left rounded object-cover object-top"
                          src={row.original.collection?.image}
                          alt={row.original.collection?.name}
                        />
                      </ImageZoom>
                    </div>
                    <div className="flex flex-[3] flex-col">
                      <span className="text-xs text-muted-foreground">
                        {t('name')}
                      </span>
                      <span className="mb-2">
                        {row.original.collection?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t('customer_code')}
                      </span>
                      <span className="mb-2">
                        {row.original.collection?.customerCode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t('manufacturer_code')}
                      </span>
                      <span className="mb-2">
                        {row.original.collection?.manufacturerCode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t('color')}
                      </span>
                      <span className="mb-2">
                        {row.original.collection?.color}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t('customer')}
                      </span>
                      <span>{row.original.collection?.customer}</span>
                    </div>
                    <div className="flex flex-[3] flex-col">
                      <span className="text-xs text-muted-foreground">
                        {t('amount')}
                      </span>
                      <span className="mb-2">{row.original.amount}</span>
                      <span className="text-xs text-muted-foreground">
                        {t('deadline')}
                      </span>
                      <span className="mb-2">
                        {moment(row.original.deadline).format('LL')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t('plm_id')}
                      </span>
                      <span className="mb-2">{row.original.plmId || '-'}</span>
                      <span className="text-xs text-muted-foreground">
                        {t('group_plm_id')}
                      </span>
                      <span className="mb-2">
                        {row.original.groupPlmId || '-'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t('status')}
                      </span>
                      <Badge variant="outline" className="self-start">
                        {t(
                          OrderStatus[
                            row.original.status as keyof typeof CollectionStatus
                          ]
                        )}
                      </Badge>
                    </div>
                    <div className="flex flex-[2] flex-col items-end  gap-2">
                      <Button
                        className="w-56"
                        onClick={() =>
                          router.push(`/collection/order/${row.original.id}`)
                        }
                        variant="secondary"
                      >
                        {t('manage_order')}
                      </Button>
                      {/* <div className="flex items-center gap-2">
                        <span className="relative flex h-[10px] w-[10px]">
                          <span
                            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                              CollectionPingColor[
                                row.original
                                  .status as keyof typeof CollectionPingColor
                              ]
                            } opacity-75`}
                          ></span>
                          <span
                            className={`relative inline-flex h-[10px] w-[10px] rounded-full ${
                              CollectionPingColor[
                                row.original
                                  .status as keyof typeof CollectionPingColor
                              ]
                            }`}
                          ></span>
                        </span>
                      </div> */}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Empty />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ServerPagination
        data={{
          count: data.count,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious,
          pages: data.pages
        }}
      />
      <AddFabricColorSheet
        state={fabricColorState}
        setState={setFabricColorState}
      />
      <EditFabricSheet state={editFabricState} setState={setEditFabricState} />
    </>
  );
}

export default CollectionOrdersTable;
