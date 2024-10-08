import api from '@/api';
import FabricColorCard from '@/components/fabric-color/fabric-color-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { flexRender } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  row: any;
  expandedRows: string[];
  setExpandedRows: React.Dispatch<React.SetStateAction<string[]>>;
  toggleRow: (id: string) => void;
}

const data = [
  { name: 'ingredients', completed: 230, failed: 335, inprogress: 453 }
];

function getRandomHexColor() {
  const hex = Math.floor(Math.random() * 0xffffff);
  const color = '#' + hex.toString(16).padStart(6, '0');
  return color;
}

function FabricRow({ row, expandedRows, setExpandedRows, toggleRow }: Props) {
  const t = useTranslations();
  const colors = useQuery({
    queryKey: ['fabric-color', row.original.id],
    queryFn: async () => {
      const res = await api.get(`/Fabrics/${row.original.id}`);
      const colors = res.data.colors;
      colors.map((color: any) => {
        const ingredients: any = {};
        color.ingredients.forEach((ingredient: any) => {
          ingredients[ingredient.name] = ingredient.percentage;
        });
        color.chartData = [ingredients];
        return color;
      });
      return colors;
    },
    enabled: expandedRows.includes(row.original.id)
  });

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
                <Badge className="border border-blue-300 bg-blue-500/30 text-blue-500 shadow-none dark:border-blue-400 dark:text-blue-300">
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
        (colors.isLoading ? (
          <TableCell colSpan={6}>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="flex gap-4 space-y-3">
                <Skeleton className="h-24 w-24 rounded bg-gray-600/20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-600/20" />
                  <Skeleton className="h-4 w-[200px] bg-gray-600/20" />
                </div>
              </div>
              <div className="flex gap-4 space-y-3">
                <Skeleton className="h-24 w-24 rounded bg-gray-600/20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-600/20" />
                  <Skeleton className="h-4 w-[200px] bg-gray-600/20" />
                </div>
              </div>
            </div>
          </TableCell>
        ) : colors.data.length === 0 ? (
          <TableCell
            className="py-8 text-center text-card-foreground/60"
            colSpan={6}
          >
            {t('no_fabrics_found')}
          </TableCell>
        ) : (
          <TableRow>
            <TableCell className="p-0" colSpan={6}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {colors.data?.map((color: any) => (
                  <FabricColorCard
                    key={color.id}
                    id={color.id}
                    img={color.image}
                    name={color.name}
                    ingredients={color.ingredients}
                  />
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}

export default FabricRow;
