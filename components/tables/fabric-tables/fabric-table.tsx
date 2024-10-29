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
import FabricRow from './fabric-row';
import { Fabric, FabricWithColors, PaginatedData } from '@/lib/types';
import ThemedTooltip from '@/components/ThemedTooltip';
import { useTranslations } from 'next-intl';
import Icon from '@/components/ui/icon';
import ServerPagination from '@/components/server-pagination';
import { SearchBar } from '@/components/searchbar';
import ThemedSelect from '@/components/themed-select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

const getColumns = (
  setColorState: any,
  setEditFabricState: any
): ColumnDef<FabricWithColors>[] => {
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
      accessorKey: 'unit',
      header: 'unit'
    },
    {
      accessorKey: 'type',
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
  ] as ColumnDef<FabricWithColors>[];
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
  data: PaginatedData<FabricWithColors>;
}

function FabricTable({ data }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
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

  const toggleRow = (id: string) => {
    if (expandedRows.includes(id)) {
      setExpandedRows((prev) => prev.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows((prev) => [...prev, id]);
    }
  };

  const handleNameSearch = useDebouncedCallback((name) => {
    const newSearchParams = getNewSearchParams('name', name);
    router.replace(newSearchParams);
  }, 300);

  const handleGrammageSearch = useDebouncedCallback((grammage) => {
    const newSearchParams = getNewSearchParams('grammage', grammage);
    router.replace(newSearchParams);
  }, 300);

  const getNewSearchParams = (key: string, value: string) => {
    let filteredUrl = `${pathname}?${key}=${value}`;
    const name = searchParams.get('name');
    const grammage = searchParams.get('grammage');

    if (name && key !== 'name') {
      filteredUrl += `&name=${name}`;
    }
    if (grammage && key !== 'grammage') {
      filteredUrl += `&grammage=${grammage}`;
    }

    return filteredUrl;
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <SearchBar
          onChange={(e) => handleNameSearch(e.target.value)}
          className="w-64"
          placeholder={t('search_fabric')}
        />
        <SearchBar
          type="number"
          onChange={(e) => handleGrammageSearch(e.target.value)}
          className="w-64"
          placeholder={t('search_grammage')}
        />
      </div>
      <Table transparent={false} rounded>
        <TableHeader>
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
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <FabricRow
                  data={row.original.colors}
                  key={row.id}
                  row={row}
                  expandedRows={expandedRows}
                  toggleRow={toggleRow}
                />
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

export default FabricTable;
