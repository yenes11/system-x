import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DataTable } from './ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

interface Props<T> {
  data: T[];
  columns: ColumnDef<Partial<T>>[];
  title: string;
  addUrl?: string;
  editUrl?: string;
  deleteUrl?: string;
  addFormSchema?: z.ZodObject<z.ZodRawShape>;
  editFormSchema?: z.ZodObject<z.ZodRawShape>;
}

function EditableTable<T>({ data }: Props<T>) {
  return (
    <React.Fragment>
      {/* <Card className="bg-nutural flex-[2] overflow-auto">
        <CardHeader className="flex-row items-center justify-between bg-muted/50 px-4 py-2">
          <CardTitle>{t('warehouses')}</CardTitle>
          <AddWarehouseSheet />
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            bordered={false}
            searchKey="name"
            data={data}
            columns={columns}
          />
        </CardContent>
      </Card> */}
    </React.Fragment>
  );
}

export default EditableTable;
