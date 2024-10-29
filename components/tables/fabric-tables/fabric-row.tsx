import api from '@/api';
import FabricColorCard from '@/components/fabric-color/fabric-color-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { FabricColor } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { flexRender } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  row: any;
  expandedRows: string[];
  toggleRow: (id: string) => void;
  data: FabricColor[];
}

function FabricRow({ data, row, expandedRows, toggleRow }: Props) {
  const t = useTranslations();
  // const colors = useQuery({
  //   queryKey: ['fabric-color', row.original.id],
  //   queryFn: async () => {
  //     const res = await api.get(`/Fabrics/${row.original.id}`);
  //     const colors = res.data.colors;
  //     colors.map((color: any) => {
  //       const ingredients: any = {};
  //       color.ingredients.forEach((ingredient: any) => {
  //         ingredients[ingredient.name] = ingredient.percentage;
  //       });
  //       color.chartData = [ingredients];
  //       return color;
  //     });
  //     return colors;
  //   },
  //   enabled: expandedRows.includes(row.original.id)
  // });

  const colors = React.useMemo(() => {
    data.map((color: any) => {
      const ingredients: any = {};
      color.ingredients.forEach((ingredient: any) => {
        ingredients[ingredient.name] = ingredient.percentage;
      });
      color.chartData = [ingredients];
      return color;
    });
    return data;
  }, [data]);

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
        (colors.length === 0 ? (
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
                {colors?.map((color: any) => (
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
