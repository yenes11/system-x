'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { PencilLine, Plus, Server } from 'lucide-react';
import AddFabricColorSheet from '@/components/fabric-color/add-fabric-color-sheet';
import EditFabricSheet from '@/components/fabric/edit-fabric-sheet';
import { Button } from '@/components/ui/button';
import Empty from '@/components/ui/empty';
import { getFabrics } from '@/lib/api-calls';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  CollectionPingColor,
  CollectionStatus,
  Fabric,
  PaginatedData
} from '@/lib/types';
import ThemedTooltip from '@/components/ThemedTooltip';
import { useTranslations } from 'next-intl';
import Icon from '@/components/ui/icon';
import ServerPagination from '@/components/server-pagination';
import ThemedZoom from '../themed-zoom';
import { Badge } from '../ui/badge';

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

  // const data = useQuery({
  //   queryKey: ['fabrics'],
  //   queryFn: getFabrics
  // });

  const columns = useMemo(() => {
    return getColumns(setFabricColorState, setEditFabricState);
  }, []);

  const table = useReactTable({
    data: data.items || [],
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <Table transparent={false} rounded>
        {/* <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    style={header.column.columnDef.meta?.style}
                    className="font-semibold"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : t(
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader> */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-4 py-4" colSpan={columns.length}>
                  <div className="mb-4 flex">
                    <div className="flex-1">
                      <ThemedZoom>
                        <img
                          className="aspect-square w-32 origin-top-left rounded object-cover object-top"
                          src={row.original.image}
                          alt={row.original.name}
                        />
                      </ThemedZoom>
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
                    <div className="flex flex-[2] items-start gap-2">
                      <Badge className="border border-blue-300 bg-blue-300/20 px-4 text-blue-500 dark:border-blue-400 dark:bg-blue-500/20 dark:text-blue-300">
                        {row.original.categoryName}
                      </Badge>
                      <Badge className="border border-blue-300 bg-blue-300/20 px-4 text-blue-500 dark:border-blue-400 dark:bg-blue-500/20 dark:text-blue-300">
                        {row.original.customerDepartment}
                      </Badge>
                      <Badge className="border border-blue-300 bg-blue-300/20 px-4 text-blue-500 dark:border-blue-400 dark:bg-blue-500/20 dark:text-blue-300">
                        {row.original.customerSeasonName}
                      </Badge>
                      <Badge className="border border-blue-300 bg-blue-300/20 px-4 text-blue-500 dark:border-blue-400 dark:bg-blue-500/20 dark:text-blue-300">
                        {row.original.sizeTypeName}
                      </Badge>
                    </div>
                    <div className="flex flex-[2] flex-col items-end justify-between gap-2">
                      <Button variant="outline">
                        {t('manage_collection')}
                      </Button>
                      <Button variant="outline">{t('manage_draft')}</Button>
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
                  <div className="-mx-4 -mb-4 flex gap-2 bg-muted px-4 py-4">
                    {row.original.colors.map((color: any) => {
                      if (color.colorName === 'Taslak') return;
                      return (
                        <Badge
                          className="rounded-md border border-teal-300 bg-teal-300/20 px-4 text-teal-500 dark:border-teal-400 dark:bg-teal-500/20 dark:text-teal-300"
                          key={color.id}
                        >
                          {color.colorName}
                        </Badge>
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
