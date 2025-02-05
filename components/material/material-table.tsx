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
import {
  Pencil,
  PencilLine,
  Plus,
  PlusCircle,
  Server,
  SquarePen,
  Trash2
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Empty from '@/components/ui/empty';
import {
  IMaterial,
  IMaterialUnit,
  MaterialUnit,
  PaginatedData
} from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import AddMaterialColorSheet from './add-material-color-sheet';
import EditMaterialSheet from './edit-material-sheet';
import MaterialRow from './material-row';
import ThemedTooltip from '../ThemedTooltip';
import Icon from '../ui/icon';
import ServerPagination from '../server-pagination';
import { SearchBar } from '../searchbar';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ThemedSelect from '../themed-select';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import AddMaterialVariantSheet from './add-material-variant-sheet';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import EditMaterialColorSheet from './edit-material-color-sheet';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import clsx from 'clsx';

type Fabric = {
  id: string;
  name: string;
  grammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
};

const getColumns = (
  setColorState: any,
  setEditState: any,
  setDeleteState: any
): ColumnDef<IMaterial>[] => {
  return [
    {
      header: '',
      id: 'expand',
      meta: {
        cellClassName: 'px-0 pl-6 w-0 max-w-0'
      },
      cell: ({ row }) => {
        if (row.original.colors.length > 0) {
          return <Icon icon="down" size={16} />;
        }
      }
    },
    {
      accessorKey: 'name',
      header: 'name',
      enableSorting: true
    },
    {
      header: 'type',
      cell: ({ row }) => {
        console.log(row.original.attributes);
        return row.original.type.name;
      }
    },
    {
      header: 'attributes',
      cell: ({ row }) => {
        return row.original.attributes.map((attr) => (
          <Badge variant="secondary" className="mr-2 rounded" key={attr.id}>
            <span className="font-light text-muted-foreground">
              {attr.name}:&nbsp;
            </span>
            {attr.value}
          </Badge>
        ));
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      header: '',
      cell: ({ row }) => {
        return (
          <div className="float-end flex gap-2">
            <ThemedTooltip text={'edit'}>
              <Button
                className="flex items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditState({
                    data: row.original,
                    open: true
                  });
                }}
              >
                <SquarePen size={16} />
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
                <Plus strokeWidth={2.5} size={18} />
              </Button>
            </ThemedTooltip>
            <ThemedTooltip
              text={
                row.original.colors.length === 0
                  ? 'delete'
                  : 'material_has_color'
              }
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (row.original.colors.length > 0) return;
                  setDeleteState({
                    id: row.original.id,
                    open: true
                  });
                }}
                className="items-center justify-center rounded-full"
                variant="ghost"
                size="icon"
              >
                <Trash2
                  className={clsx(
                    'text-destructive',
                    row.original.colors.length > 0 && 'text-destructive/50'
                  )}
                  size={16}
                />
              </Button>
            </ThemedTooltip>
          </div>
        );
      }
    }
  ] as ColumnDef<IMaterial>[];
};

interface Props {
  data: PaginatedData<IMaterial>;
}

interface SheetState {
  id: string;
  open: boolean;
}

interface MaterialState {
  data: IMaterial | null;
  open: boolean;
}

function MaterialTable({ data }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editMaterialColorState, setEditMaterialColorState] = useState({
    open: false,
    data: null
  });
  const [expandedColorRows, setExpandedColorRows] = useState<string[]>([]);
  const [expandedVariantRows, setExpandedVariantRows] = useState<string[]>([]);
  const [materialColorState, setMaterialColorState] = useState<SheetState>({
    id: '',
    open: false
  });

  const [materialVariantState, setMaterialVariantState] = useState<
    SheetState & { variantUnit: string }
  >({
    id: '',
    variantUnit: '',
    open: false
  });

  const [editMaterialState, setEditMaterialState] = useState<MaterialState>({
    data: null,
    open: false
  });

  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });

  const [deleteColorState, setDeleteColorState] = useState({
    id: '',
    open: false
  });

  const materialTypes = useQuery({
    queryKey: ['material-types'],
    queryFn: async () => {
      const res = await api.get('/MaterialTypes');
      return res.data;
    },
    select: (data) => [
      {
        id: 'all',
        name: t('all')
      },
      ...data
    ]
  });

  const columns = useMemo(() => {
    return getColumns(
      setMaterialColorState,
      setEditMaterialState,
      setDeleteState
    );
  }, []);

  const table = useReactTable({
    data: data.items || [],
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const getNewSearchParams = (key: string, value: string) => {
    let filteredUrl = `${pathname}`;
    const params = new URLSearchParams(searchParams);

    if (
      value.trim() === '' ||
      (key === 'type' && value.toLowerCase() === 'all')
    ) {
      // Remove the key from the params if the value is empty or if the key is 'type' and value is 'all'
      params.delete(key);
    } else {
      // Update or set the key in the params
      params.set(key, value);
    }

    // Construct the URL with the updated search parameters
    filteredUrl += params.toString() ? `?${params.toString()}` : '';

    return filteredUrl;
  };

  const toggleColorRow = (id: string) => {
    if (expandedColorRows.includes(id)) {
      setExpandedColorRows((prev) => prev.filter((rowId) => rowId !== id));
    } else {
      setExpandedColorRows((prev) => [...prev, id]);
    }
  };

  const toggleVariantRow = (id: string) => {
    if (expandedVariantRows.includes(id)) {
      setExpandedVariantRows((prev) => prev.filter((rowId) => rowId !== id));
    } else {
      setExpandedVariantRows((prev) => [...prev, id]);
    }
  };

  const handleNameSearch = useDebouncedCallback((name) => {
    const newSearchParams = getNewSearchParams('name', name);
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

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <SearchBar
          onChange={(e) => handleNameSearch(e.target.value)}
          className="w-64"
          placeholder={t('search_material')}
        />
        <ThemedSelect
          onClear={() => clearSearchParam('type')}
          options={materialTypes.data || []}
          value={searchParams.get('type') || ''}
          onValueChange={(value) => handleSearchParams('type', value)}
          placeholder={t('select_a_type')}
        />
      </div>
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
                  expandedColorRows={expandedColorRows}
                  expandedVariantRows={expandedVariantRows}
                  toggleColorRow={toggleColorRow}
                  toggleVariantRow={toggleVariantRow}
                  setMaterialVariantState={setMaterialVariantState}
                  setEditMaterialColorState={setEditMaterialColorState}
                  setDeleteColorState={setDeleteColorState}
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
          pages: data.pages,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious,
          count: data.count
        }}
      />
      <EditMaterialColorSheet
        state={editMaterialColorState}
        setState={setEditMaterialColorState}
      />
      <AddMaterialColorSheet
        state={materialColorState}
        setState={setMaterialColorState}
      />
      <EditMaterialSheet
        state={editMaterialState}
        setState={setEditMaterialState as any}
      />
      <AddMaterialVariantSheet
        state={materialVariantState}
        setState={setMaterialVariantState}
      />
      <ConfirmDeleteDialog
        state={deleteState}
        setState={setDeleteState}
        endpoint="/Materials"
        mutationKey={['materials', deleteState.id]}
        title={t('delete_material')}
      />
      <ConfirmDeleteDialog
        state={deleteColorState}
        setState={setDeleteColorState}
        endpoint="/MaterialColors"
        mutationKey={['material-colors', deleteColorState.id]}
        title={t('delete_material_color')}
      />
    </>
  );
}

export default MaterialTable;
