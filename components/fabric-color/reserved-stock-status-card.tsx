'use client';

import { Blocks, Link } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import ReservedStockDialog from './reserved-stock-dialog';

interface Props {
  value: number;
  unit: string;
}

function ReservedStockStatusCard({ value, unit }: Props) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Card>
        <CardContent className="flex h-full items-center gap-4 p-4">
          <span className="rounded-lg bg-theme-blue/10 p-4">
            {<Blocks className="text-theme-blue-foreground" />}
          </span>
          <div>
            <span className="flex text-xs font-medium text-muted-foreground">
              {t('reserved_stock')}
              <Link
                onClick={() => setOpen(true)}
                role="button"
                className="ml-2 size-4 hover:text-white"
              />
            </span>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        </CardContent>
      </Card>
      <ReservedStockDialog
        isEmpty={value === 0}
        unit={unit}
        open={open}
        setOpen={setOpen}
      />
    </React.Fragment>
  );
}

export default ReservedStockStatusCard;
