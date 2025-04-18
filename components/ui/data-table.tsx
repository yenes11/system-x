'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { PaginatedData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '../searchbar';
import ServerPagination from '../server-pagination';
import Empty from './empty';
import React from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | PaginatedData<TData>;
  searchKey: string;
  bordered?: boolean;
  rounded?: boolean;
  transparent?: boolean;
  inputClassName?: string;
  className?: string;
  emptyDescription?: string;
  serverPagination?: boolean;
  footer?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  bordered = false,
  rounded = false,
  transparent = true,
  className,
  emptyDescription,
  inputClassName,
  serverPagination = false,
  footer
}: DataTableProps<TData, TValue>) {
  const t = useTranslations();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const size = Number(searchParams.get('size')) || 5;
  const index = Number(searchParams.get('index')) || 0;

  const isUsingServerPagination = !Array.isArray(data);
  const tableData = isUsingServerPagination ? data['items'] : data;

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageSize: 9999,
        pageIndex: 0
      }
    }
    // onPaginationChange: setPagination,
    // state: {
    //   pagination: {
    //     pageIndex
    //   },
    // },
  });

  const previousPage = () => {
    table.previousPage();
  };

  return (
    <>
      {searchKey && (
        <SearchBar
          placeholder={t('search')}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className={cn('mb-2 w-full md:max-w-sm', inputClassName)}
        />
      )}

      <Table
        rounded={rounded}
        bordered={bordered}
        transparent={transparent}
        className={cn('relative', className)}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className={cn(
                      header.column.columnDef.meta?.headerClassName,
                      'text-nowrap'
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder || !header.column.columnDef.header
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
                  <TableCell
                    className={cell.column.columnDef.meta?.cellClassName}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Empty description={emptyDescription} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="bg-muted">{footer}</TableFooter>
      </Table>

      {isUsingServerPagination && (
        <ServerPagination
          data={{
            pages: data['pages'],
            hasNext: data['hasNext'],
            hasPrevious: data['hasPrevious'],
            count: data['count']
          }}
        />
      )}
    </>
  );
}
