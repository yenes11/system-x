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
import { PencilLine, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Empty from '@/components/ui/empty';
import { IMaterial, MaterialUnit } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import AddMaterialColorSheet from './add-material-color-sheet';
import EditMaterialSheet from './edit-material-sheet';
import MaterialRow from './material-row';
import ThemedTooltip from '../ThemedTooltip';

type Fabric = {
  id: string;
  name: string;
  grammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
};

const getColumns = (
  setColorState: any,
  setEditFabricState: any
): ColumnDef<IMaterial>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'name'
    },
    {
      accessorKey: 'unit',
      header: 'unit',
      cell: ({ row }) => {
        return <Badge>{MaterialUnit[row.original.unit]}</Badge>;
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      header: '',
      cell: ({ row }) => {
        return (
          <div className="float-end flex gap-2">
            <ThemedTooltip text={'edit_material'}>
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
                <PencilLine size={16} />
              </Button>
            </ThemedTooltip>
            <ThemedTooltip text={'add_color_to_material'}>
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
                <Plus size={16} />
              </Button>
            </ThemedTooltip>
          </div>
        );
      }
    }
  ] as ColumnDef<IMaterial>[];
};

interface Props {
  data: IMaterial[];
}

interface MaterialState {
  data: IMaterial | null;
  open: boolean;
}

function MaterialTable({ data }: Props) {
  const t = useTranslations();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [materialColorState, setMaterialColorState] = useState<{
    id: string;
    open: boolean;
  }>({
    id: '',
    open: false
  });

  const [editMaterialState, setEditMaterialState] = useState<MaterialState>({
    data: null,
    open: false
  });

  const columns = useMemo(() => {
    return getColumns(setMaterialColorState, setEditMaterialState);
  }, []);

  const table = useReactTable({
    data: data || [],
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

  return (
    <>
      <Table rounded transparent={false}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="font-semibold" key={header.id}>
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
                <MaterialRow
                  colors={row.original.colors}
                  key={row.id}
                  row={row}
                  expandedRows={expandedRows}
                  setExpandedRows={setExpandedRows}
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
      <AddMaterialColorSheet
        state={materialColorState}
        setState={setMaterialColorState}
      />
      <EditMaterialSheet
        state={editMaterialState}
        setState={setEditMaterialState as any}
      />
    </>
  );
}

export default MaterialTable;
