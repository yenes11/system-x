import '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    style: {
      textAlign: 'left' | 'center' | 'right';
    };
  }
}
