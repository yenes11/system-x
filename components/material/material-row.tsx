import api from '@/api';
import FabricColorCard from '@/components/fabric-color/fabric-color-card';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { IColor, MaterialColor } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { flexRender } from '@tanstack/react-table';
import React, { Dispatch, SetStateAction } from 'react';
import Empty from '../ui/empty';
import MaterialColorCard from './material-color-card.';
import { useTranslations } from 'next-intl';
import Icon from '../ui/icon';
import ThemedTooltip from '../ThemedTooltip';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  row: any;
  expandedColorRows: string[];
  expandedVariantRows: string[];
  toggleColorRow: (id: string) => void;
  toggleVariantRow: (id: string) => void;
  colors: MaterialColor[];
  setEditMaterialColorState: any;
  setDeleteColorState: Dispatch<SetStateAction<{ id: string; open: boolean }>>;
  setMaterialVariantState: Dispatch<
    SetStateAction<{ id: string; open: boolean; variantUnit: string }>
  >;
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
  expandedColorRows,
  expandedVariantRows,
  toggleColorRow,
  toggleVariantRow,
  setMaterialVariantState,
  setEditMaterialColorState,
  setDeleteColorState,
  colors
}: Props) {
  const t = useTranslations();
  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={(event) => {
          toggleColorRow(row.original.id);
        }}
        data-state={row.getIsSelected() && 'selected'}
      >
        {row.getVisibleCells().map((cell: any) => {
          return (
            <TableCell
              className={cell.column.columnDef.meta?.cellClassName}
              key={cell.id}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </TableRow>
      {expandedColorRows.includes(row.original.id) &&
        (colors.length === 0 ? (
          <TableCell colSpan={6}>
            <Empty description={t('material_table_empty_description')} />
          </TableCell>
        ) : (
          <TableRow>
            <TableCell className="p-0" colSpan={6}>
              {colors.map((color) => (
                <>
                  <div
                    onClick={() => toggleVariantRow(color.id)}
                    className="flex cursor-pointer items-center bg-muted px-6 py-2"
                  >
                    <div className="mr-8 h-4 w-4">
                      {color.variants.length > 0 && (
                        <Icon icon="down" currentColor size={16} />
                      )}
                    </div>
                    {color.name}
                    <div className="ml-auto flex gap-2">
                      <ThemedTooltip text={'edit_color'}>
                        <Button
                          className="flex items-center justify-center rounded-full"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            console.log(color, 'o satırs');
                            e.stopPropagation();
                            setEditMaterialColorState({
                              open: true,
                              data: color
                            });
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                      </ThemedTooltip>
                      <ThemedTooltip text={'add_variant'}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMaterialVariantState({
                              open: true,
                              id: color.id,
                              variantUnit: row.original.type.variantUnit
                            });
                          }}
                          className="flex items-center justify-center rounded-full"
                          variant="ghost"
                          size="icon"
                        >
                          <Icon currentColor icon="plus" size={16} />
                        </Button>
                      </ThemedTooltip>
                      <ThemedTooltip
                        text={
                          color.variants.length === 0
                            ? 'delete'
                            : 'color_has_variant'
                        }
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (color.variants.length > 0) return;
                            setDeleteColorState({
                              open: true,
                              id: color.id
                            });
                          }}
                          className="flex items-center justify-center rounded-full"
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2
                            className={clsx(
                              'size-4 text-destructive',
                              color.variants.length > 0 && 'text-destructive/50'
                            )}
                          />
                        </Button>
                      </ThemedTooltip>
                    </div>
                  </div>
                  {expandedVariantRows.includes(color.id) &&
                    (color.variants.length === 0 ? (
                      <Empty
                        className="my-6"
                        description={t('material_variant_empty_description')}
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2">
                        {color.variants.map((variant) => (
                          <MaterialColorCard
                            key={variant.id}
                            id={variant.id}
                            img={variant.image}
                            size={variant.size}
                            unit={row.original.type.variantUnit}
                          />
                        ))}
                      </div>
                    ))}
                </>
              ))}
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}

export default MaterialRow;

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};
