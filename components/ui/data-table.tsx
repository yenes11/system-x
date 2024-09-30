'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from './input';
import { Button } from './button';
import { ScrollArea, ScrollBar } from './scroll-area';
import Empty from './empty';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { ClassValue } from 'class-variance-authority/types';
import { SearchBar } from '../searchbar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PaginatedData } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
} from './select';
import ServerPagination from '../server-pagination';

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
  serverPagination = false
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
          placeholder={`Search...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className={cn('mb-2 w-full rounded-full md:max-w-sm', inputClassName)}
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
                  <TableHead key={header.id}>
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
