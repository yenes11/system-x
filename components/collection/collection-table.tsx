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
  CollectionPingColor,
  CollectionStatus,
  Fabric,
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

const getColumns = (
  setColorState: any,
  setEditFabricState: any
): ColumnDef<any>[] => {
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
  ] as ColumnDef<any>[];
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
  data: PaginatedData<Fabric>;
}

function CollectionTable({ data }: Props) {
  const t = useTranslations();
  const [fabricColorState, setFabricColorState] = useState({
    id: '',
    open: false
  });
  const [editFabricState, setEditFabricState] = useState({
    data: null,
    open: false
  });

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

  const selectedCategory = categories.data?.find(
    (c: any) => searchParams.get('categoryId') === c.id
  );

  const selectedCustomer = customers.data?.items.find(
    (c: any) => searchParams.get('customerId') === c.id
  );
  const selectedStatus =
    CollectionStatus[
      searchParams.get('status') as unknown as keyof typeof CollectionStatus
    ];

  const handleSearch = useDebouncedCallback((customerCode) => {
    const newSearchParams = getNewSearchParams('customerCode', customerCode);
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
    const customerId = searchParams.get('customerId');
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const customerCode = searchParams.get('customerCode');

    // Construct the updated query parameters based on conditions
    const params = new URLSearchParams();

    if (key !== 'customerId' && customerId) {
      params.set('customerId', customerId);
    }
    if (key !== 'categoryId' && categoryId) {
      params.set('categoryId', categoryId);
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

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <SearchBar
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
          placeholder={t('enter_a_customer_code')}
        />

        <ThemedSelect
          onClear={() => clearSearchParam('customerId')}
          value={searchParams.get('customerId') || ''}
          options={customersOptions}
          onValueChange={(value) => handleSearchParams('customerId', value)}
          placeholder={t('select_a_customer')}
        />

        <ThemedSelect
          onClear={() => clearSearchParam('categoryId')}
          options={categoriesOptions}
          value={searchParams.get('categoryId') || ''}
          onValueChange={(value) => handleSearchParams('categoryId', value)}
          placeholder={t('select_a_category')}
        />
        <ThemedSelect
          onClear={() => clearSearchParam('status')}
          value={searchParams.get('status') || ''}
          onValueChange={(value) => handleSearchParams('status', value)}
          options={[allOption, ...collectionOptions]}
          placeholder={t('select_a_status')}
        />
      </div>
      <Table transparent={false} rounded>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-4 py-4" colSpan={columns.length}>
                  <div className="mb-4 flex">
                    <div className="flex-1 pr-2">
                      <ImageZoom>
                        {/* <Image
                          width={128}
                          height={128}
                          className="mr-2 aspect-square w-32 min-w-32 origin-top-left rounded object-cover object-top"
                          src={row.original.image}
                          alt={row.original.name}
                        /> */}
                        <img
                          className="mr-2 aspect-square w-32 min-w-32 origin-top-left rounded object-cover object-top"
                          src={row.original.image}
                          alt={row.original.name}
                        />
                      </ImageZoom>
                    </div>
                    <div className="flex flex-[3] flex-col">
                      <span className="text-xs text-muted-foreground">
                        {t('name')}
                      </span>
                      <span className="mb-2">{row.original.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {t('customer_code')}
                      </span>
                      <span className="mb-2">{row.original.customerCode}</span>
                      <span className="text-xs text-muted-foreground">
                        {t('manufacturer_code')}
                      </span>
                      <span>{row.original.manufacturerCode}</span>
                    </div>
                    <div className="px-4">
                      <Badge className="mb-2 mr-2 border-theme-blue-foreground/25 bg-theme-blue/20 text-theme-blue-foreground">
                        {row.original.categoryName}
                      </Badge>
                      <Badge className="mb-2 mr-2 border-theme-blue-foreground/25 bg-theme-blue/20 text-theme-blue-foreground">
                        {row.original.customerDepartment}
                      </Badge>
                      <Badge className="mb-2 mr-2 border-theme-blue-foreground/25 bg-theme-blue/20 text-theme-blue-foreground">
                        {row.original.customerSeasonName}
                      </Badge>
                      <Badge className="mb-2 mr-2 border-theme-blue-foreground/25 bg-theme-blue/20 text-theme-blue-foreground">
                        {row.original.sizeTypeName}
                      </Badge>
                    </div>
                    <div className="flex flex-[2] flex-col items-end  gap-2">
                      <Button
                        className="w-56"
                        onClick={() =>
                          router.push(
                            `/collection/manage-collection/${row.original.id}`
                          )
                        }
                        size="sm"
                        variant="secondary"
                      >
                        {t('manage_collection')}
                      </Button>
                      <Button
                        className="w-56"
                        onClick={() =>
                          router.push(
                            `/collection/manage-draft/${row.original.draftColor.id}`
                          )
                        }
                        size="sm"
                        variant="outline"
                      >
                        {t('manage_draft')}
                      </Button>
                      <div className="flex items-center gap-2">
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
                        <span>
                          {t(
                            CollectionStatus[
                              row.original
                                .status as keyof typeof CollectionStatus
                            ]
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="-mx-4 -mb-4 flex flex-wrap gap-2 bg-muted px-4 py-4">
                    {row.original.colors.map((color: any, index: number) => {
                      if (color.colorName === 'Taslak') return;
                      return (
                        <Link
                          href={`/collection/manage-color/${color.id}`}
                          key={color.id}
                        >
                          <Badge
                            color={
                              index % 5 === 0
                                ? 'blue'
                                : index % 5 === 1
                                ? 'amber'
                                : index % 5 === 2
                                ? 'green'
                                : index % 5 === 3
                                ? 'orange'
                                : 'violet'
                            }
                            // className="rounded-md border-theme-teal-foreground/30 bg-theme-teal/15 text-theme-teal-foreground"
                          >
                            {color.colorName}
                          </Badge>
                        </Link>
                      );
                    })}
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

export default CollectionTable;
