import api from '@/api';
import FabricColorCard from '@/components/fabric-color/fabric-color-card';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { IColor } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { flexRender } from '@tanstack/react-table';
import React from 'react';
import Empty from '../ui/empty';
import MaterialColorCard from './material-color-card.';

interface Props {
  row: any;
  expandedRows: string[];
  setExpandedRows: React.Dispatch<React.SetStateAction<string[]>>;
  toggleRow: (id: string) => void;
  colors: IColor[];
}

const data = [
  { name: 'ingredients', completed: 230, failed: 335, inprogress: 453 }
];

function getRandomHexColor() {
  const hex = Math.floor(Math.random() * 0xffffff);
  const color = '#' + hex.toString(16).padStart(6, '0');
  return color;
}

function MaterialRow({
  row,
  expandedRows,
  setExpandedRows,
  toggleRow,
  colors
}: Props) {
  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={(event) => {
          toggleRow(row.original.id);
        }}
        data-state={row.getIsSelected() && 'selected'}
      >
        {row.getVisibleCells().map((cell: any) => {
          if (cell.column.id === 'fabricTypeName')
            return (
              <TableCell key={cell.id}>
                <Badge className="bg-blue-500/30 text-blue-600 shadow-none hover:bg-blue-100/80">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Badge>
              </TableCell>
            );
          return (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </TableRow>
      {expandedRows.includes(row.original.id) &&
        (colors.length === 0 ? (
          <TableCell colSpan={6}>
            <Empty />
          </TableCell>
        ) : (
          <TableRow>
            <TableCell className="p-0" colSpan={6}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {colors.map((color: any) => (
                  <MaterialColorCard
                    key={color.id}
                    id={color.id}
                    img={color.image}
                    name={color.name}
                  />
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}

export default MaterialRow;
