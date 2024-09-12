'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTranslations } from 'next-intl';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AddSeasonSheet } from './add-season-sheet';
import { EditSeasonSheet } from './edit-season-sheet';
import ConfirmDeleteDialog from '../confirm-delete-dialog';

const getSeasonsTableColumns = (setEditState: any, setDeleteState: any) => [
  {
    accessorKey: 'name',
    header: 'name'
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: { row: any }) => {
      return (
        <div className="float-end flex gap-2">
          <Button
            className="flex items-center justify-center rounded-full"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              setEditState({
                open: true,
                data: row.original
              });
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            onClick={(e) => {
              setDeleteState({
                open: true,
                id: row.original.id
              });
            }}
            className="flex items-center justify-center rounded-full"
            variant="ghost"
            size="icon"
          >
            <Trash2 className="text-destructive" size={16} />
          </Button>
        </div>
      );
    }
  }
];

function SeasonsTable({ data }: { data: any }) {
  const t = useTranslations();
  const [deleteState, setDeleteState] = useState({
    id: '',
    open: false
  });
  const [editState, setEditState] = useState({
    data: {
      id: '',
      name: ''
    },
    open: false
  });

  const columns = useMemo(() => {
    return getSeasonsTableColumns(setEditState, setDeleteState);
  }, []);

  return (
    <>
      <EditSeasonSheet state={editState} setState={setEditState} />
      <ConfirmDeleteDialog
        endpoint="/CustomerSeasons"
        mutationKey={['delete-customer-season']}
        state={deleteState}
        setState={setDeleteState}
        title={t('delete_season')}
      />
      <Card className="flex-1 overflow-auto p-0">
        <CardContent className="p-0">
          <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-2">
            <CardTitle className="font-semibold">{t('seasons')}</CardTitle>
            <AddSeasonSheet />
          </CardHeader>

          <DataTable
            bordered={false}
            searchKey=""
            data={data}
            columns={columns}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default SeasonsTable;
