'use client';

import React from 'react';
import { Separator } from '../ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { ProductStation } from '@/lib/types';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import AddStationDialog from './add-station-dialog';
import TransferList from './transfer-list';
import Empty from '../ui/empty';

interface Props {
  data: ProductStation[];
}

function ProductStationsStepper({ data }: Props) {
  const t = useTranslations();
  const sortedData = data.toSorted((a, b) => a.priority - b.priority);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-end gap-2">
        <CardTitle className="mr-auto text-xl">
          {t('product_stations')}
        </CardTitle>
        {data.length > 0 ? (
          <Button disabled>{t('edit')}</Button>
        ) : (
          <AddStationDialog />
        )}
      </CardHeader>
      <CardContent className="pb-20 pt-4">
        <div className="flex items-center gap-2 px-20 text-sm text-card-foreground">
          {data.length > 0 ? (
            sortedData.map((station, index) => (
              <React.Fragment key={station.id}>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200">
                  <span className="text-emerald-600">{station.priority}</span>
                  <span className="absolute left-1/2 top-12 w-40 -translate-x-1/2 text-center text-emerald-500">
                    {station.name}
                  </span>
                </div>
                {index !== sortedData.length - 1 && (
                  <div className="h-px flex-1 rounded-full bg-emerald-100"></div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="w-full">
              <Empty />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductStationsStepper;
