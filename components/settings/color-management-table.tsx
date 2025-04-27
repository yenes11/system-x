'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Palette,
  SquarePen,
  Trash2
} from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import api from '@/api';
import { Color, DataState, IDState } from '@/lib/types';
import moment from 'moment';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import React from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import EditColorSheet from './edit-color-sheet';
import { SearchBar } from '../searchbar';
import ClientPagination from '../client-pagination';
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '../ui/pagination';
import AddColorSheet from './add-color.sheet';

function ColorManagementTable() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [query, setQuery] = React.useState('');

  const [editState, setEditState] = React.useState<DataState<Color>>({
    data: null,
    open: false
  });
  const [deleteState, setDeleteState] = React.useState<IDState>({
    id: '',
    open: false
  });

  const colors = useSuspenseQuery<Color[]>({
    queryKey: ['colors-settings'],
    queryFn: async () => {
      const response = await api.get('/Colors');
      return response.data;
    }
  });

  const currentColors = colors.data
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .slice((currentPage - 1) * 10, currentPage * 10);

  const columns: ColumnDef<Color>[] = [
    {
      accessorKey: 'name',
      header: 'name'
    },
    {
      header: 'actions',
      meta: {
        cellClassName: 'float-right',
        headerClassName: 'text-right'
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <SquarePen
              onClick={() => {
                setEditState({
                  data: row.original,
                  open: true
                });
              }}
              role="button"
              className="size-8 rounded-full p-2 hover:bg-muted"
            />
            <Trash2
              onClick={() => {
                setDeleteState({
                  id: row.original.id,
                  open: true
                });
              }}
              role="button"
              className="size-8 rounded-full p-2 text-destructive hover:bg-muted"
            />
          </div>
        );
      }
    }
  ];

  return (
    <React.Fragment>
      <ConfirmDeleteDialog
        title={t('delete_color')}
        endpoint="/Colors"
        mutationKey={['delete-settings-color', deleteState.id]}
        state={deleteState}
        setState={setDeleteState}
      />
      <EditColorSheet state={editState} setState={setEditState} />
      <Card>
        <CardHeader className="flex-row items-center border-b py-4">
          <Palette className="mr-2 size-6" />
          {t('color_management')}
          <AddColorSheet />
        </CardHeader>
        <CardContent className="p-0">
          <SearchBar
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
            className="m-2 max-w-64"
          />
          <DataTable data={currentColors} columns={columns} searchKey="" />
          <TablePagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(colors.data.length / 10)}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default ColorManagementTable;

function TablePagination({
  currentPage,
  setCurrentPage,
  totalPages
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}) {
  return (
    <Pagination className="border-t p-2">
      <PaginationContent className="w-full justify-center gap-3">
        <PaginationItem>
          <Button
            variant="outline"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? 'link' : undefined}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Previous
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="outline"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            disabled={currentPage === totalPages ? true : false}
            role={currentPage === totalPages ? 'link' : undefined}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
            <ChevronRight
              className="-me-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
