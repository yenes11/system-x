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

import AddFabricColorSheet from '@/components/fabric-color/add-fabric-color-sheet';
import EditFabricSheet from '@/components/fabric/edit-fabric-sheet';
import { Button } from '@/components/ui/button';
import Empty from '@/components/ui/empty';
import { getFabrics } from '@/lib/api-calls';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import FabricRow from './fabric-row';

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
): ColumnDef<Fabric>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'grammage',
      header: 'Grammage'
    },
    {
      accessorKey: 'fabricUnitName',
      header: 'Unit'
    },
    {
      accessorKey: 'fabricTypeName',
      header: 'Fabric Type'
    },
    {
      id: 'actions',
      enableHiding: false,
      // header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="float-end flex gap-2">
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
          </div>
        );
      }
    }
  ] as ColumnDef<Fabric>[];
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
  data: Data;
}

function FabricTable() {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [fabricColorState, setFabricColorState] = useState({
    id: '',
    open: false
  });
  const [editFabricState, setEditFabricState] = useState({
    data: null,
    open: false
  });

  const fabrics = useQuery({
    queryKey: ['fabrics'],
    queryFn: getFabrics
  });

  const columns = useMemo(() => {
    return getColumns(setFabricColorState, setEditFabricState);
  }, []);

  const table = useReactTable({
    data: fabrics?.data?.items || [],
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
      <Table transparent={false} rounded>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="font-semibold" key={header.id}>
                    {header.isPlaceholder
                      ? null
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
            table
              .getRowModel()
              .rows.map((row) => (
                <FabricRow
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
      <AddFabricColorSheet
        state={fabricColorState}
        setState={setFabricColorState}
      />
      <EditFabricSheet state={editFabricState} setState={setEditFabricState} />
    </>
  );
}

export default FabricTable;
