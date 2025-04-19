'use client';

import api from '@/api';
import { EMPTY } from '@/constants/all';
import { collectionSampleStatus, collectionSampleType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  CheckCircle,
  CircleX,
  Download,
  Paperclip,
  SquarePen,
  Trash2
} from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Fragment, useState } from 'react';
import ConfirmDeleteDialog from '../confirm-delete-dialog';
import ImageZoom from '../image-zoom';
import Translate from '../translate';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Empty from '../ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { AddSampleSheet } from './add-sample-sheet';
import { EditSampleSheet } from './edit-sample-sheet';

const DATE_FORMAT = 'DD/MM/YYYY, HH:mm';

const getSamplesTableColumns = (setEditState: any, setDeleteState: any) => [
  {
    id: 'image',
    header: 'image',
    cell: ({ row }: { row: any }) => {
      return (
        <ImageZoom>
          <img
            className="size-10 cursor-zoom-in object-cover object-top"
            src={row.original?.imagePath}
          />
        </ImageZoom>
      );
    }
  },
  {
    id: 'type',
    header: 'type',
    cell: ({ row }: { row: any }) => {
      return (
        <Badge className="rounded-md border-border bg-transparent py-1">
          {
            collectionSampleType[
              row.original?.type as keyof typeof collectionSampleType
            ]
          }
        </Badge>
      );
    }
  },
  {
    id: 'status',
    header: 'status',
    cell: ({ row }: { row: any }) => {
      return (
        <Badge className="rounded-md border-border bg-transparent py-1">
          <Translate
            message={collectionSampleStatus[
              row.original?.status as keyof typeof collectionSampleStatus
            ].toLocaleLowerCase()}
          />
        </Badge>
      );
    }
  },
  {
    accessorKey: 'description',
    header: 'description'
  },
  {
    accessorKey: 'modelistFullName',
    header: 'modelist'
  },
  {
    id: 'mantuamaker',
    header: 'mantuamaker',
    cell: ({ row }: { row: any }) => {
      return row.original?.mantuamakerFullName || EMPTY;
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }: { row: any }) => {
      return (
        <div className="float-end flex gap-2">
          <Link
            className={cn({
              'pointer-events-none': !row.original.documentPath
            })}
            target="_blank"
            download
            href={row.original.documentPath}
          >
            <Button
              disabled={!row.original.documentPath}
              className="flex items-center justify-center rounded-full"
              variant="ghost"
              size="icon"
            >
              <Download size={16} />
            </Button>
          </Link>
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
            <SquarePen size={16} />
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

function SamplesTable() {
  const t = useTranslations();
  const params = useParams();
  const [editState, setEditState] = useState({
    open: false,
    data: null
  });
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: null
  });
  const [searchQueries, setSearchQueries] = useState({
    index: 0,
    size: 10
  });
  const url = `/Samples?Id=${params?.id}&PageIndex=${searchQueries.index}&PageSize=${searchQueries.size}`;

  const samples = useQuery({
    queryKey: ['collection-samples', url],
    queryFn: async () => {
      const res = await api.get(url);
      return res.data;
    }
  });

  const table = useReactTable({
    data: samples.data?.items || [],
    columns: getSamplesTableColumns(setEditState, setDeleteState),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: searchQueries.index,
        pageSize: searchQueries.size
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: searchQueries.index,
          pageSize: searchQueries.size
        });
        setSearchQueries({
          index: newState.pageIndex,
          size: newState.pageSize
        });
      }
    },
    pageCount: Math.ceil((samples.data?.total || 0) / searchQueries.size),
    manualPagination: true
  });

  console.log(deleteState, 'deleteState');
  return (
    <Fragment>
      <EditSampleSheet state={editState} setState={setEditState} />
      <ConfirmDeleteDialog
        endpoint="/Samples"
        state={deleteState}
        setState={setDeleteState}
        mutationKey={['delete-sample', 'collection-samples']}
        title={t('delete_sample')}
      />
      <Card className="!overflow-hidden">
        <CardHeader className="flex h-16 flex-row items-center justify-end gap-2 border-b py-0">
          <Paperclip className="size-6" />
          <CardTitle className="mr-auto text-lg">{t('samples')}</CardTitle>
          <AddSampleSheet />
        </CardHeader>
        <CardContent className="p-0 @container">
          <Table
            rounded={false}
            bordered={false}
            transparent={true}
            className="relative"
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
                  <Fragment key={row.id}>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className={cell.column.columnDef.meta?.cellClassName}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="p-0" colSpan={7}>
                        <div>
                          <div>
                            <ol className="grid grid-cols-1 divide-x divide-border overflow-hidden text-sm text-muted-foreground sm:grid-cols-4">
                              <li
                                className={cn(
                                  'flex items-center justify-center gap-2 bg-background p-3',
                                  'text-green-500'
                                )}
                              >
                                <CheckCircle />

                                <p className="leading-none ">
                                  <strong className="block font-medium">
                                    {t('created')}
                                  </strong>
                                  <small className="mt-1">
                                    {row.original?.createdDate
                                      ? moment(row.original.createdDate).format(
                                          DATE_FORMAT
                                        )
                                      : t('to_be_determined')}
                                  </small>
                                </p>
                              </li>

                              <li
                                className={cn(
                                  'relative flex items-center justify-center gap-2 bg-background p-3',
                                  row.original?.producedDate && 'text-green-500'
                                )}
                              >
                                <span className="absolute -left-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border border-border bg-background sm:block"></span>
                                <span className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border border-border bg-background sm:block"></span>

                                <CheckCircle />

                                <p className="leading-none">
                                  <strong className="block font-medium">
                                    {t('produced')}
                                  </strong>
                                  <small className="mt-1">
                                    {row.original?.producedDate
                                      ? moment(
                                          row.original.producedDate
                                        ).format(DATE_FORMAT)
                                      : t('to_be_determined')}
                                  </small>
                                </p>
                              </li>

                              <li
                                className={cn(
                                  'flex items-center justify-center gap-2 bg-background p-3',
                                  row.original?.sentDate && 'text-green-500'
                                )}
                              >
                                <CheckCircle />

                                <p className="leading-none">
                                  <strong className="block font-medium">
                                    {t('sent')}
                                  </strong>
                                  <small className="mt-1">
                                    {row.original?.sentDate
                                      ? moment(row.original.sentDate).format(
                                          DATE_FORMAT
                                        )
                                      : t('to_be_determined')}
                                  </small>
                                </p>
                              </li>
                              <li
                                className={cn(
                                  'relative flex items-center justify-center gap-2 bg-background p-3',
                                  row.original?.status === 4
                                    ? 'text-green-500'
                                    : row.original?.status === 5
                                    ? 'text-destructive'
                                    : ''
                                )}
                              >
                                <span className="absolute -left-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border border-border bg-background sm:block"></span>
                                {row.original?.status === 4 ? (
                                  <CheckCircle />
                                ) : row.original?.status === 5 ? (
                                  <CircleX />
                                ) : (
                                  <CheckCircle />
                                )}

                                <p className="leading-none">
                                  <strong className="block font-medium">
                                    {t('result')}
                                  </strong>
                                  <small className="mt-1">
                                    {row.original?.resultDate
                                      ? moment(row.original.resultDate).format(
                                          DATE_FORMAT
                                        )
                                      : t('to_be_determined')}
                                  </small>
                                </p>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-32" colSpan={6}>
                    <Empty className="w-full" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Fragment>
  );
}

export default SamplesTable;
