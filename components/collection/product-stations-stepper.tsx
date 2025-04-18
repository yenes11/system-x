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
import { Waypoints } from 'lucide-react';

interface Props {
  data: ProductStation[];
  editable?: boolean;
}

function ProductStationsStepper({ data, editable = true }: Props) {
  const t = useTranslations();
  const sortedData = data.toSorted((a, b) => a.priority - b.priority);

  return (
    <Card>
      <CardHeader className="flex h-16 flex-row items-center justify-end gap-2 border-b py-0">
        <Waypoints className="size-6" />
        <CardTitle className="mr-auto text-lg">
          {t('product_stations')}
        </CardTitle>
        {/* {data.length > 0 && editable ? (
          <Button disabled>{t('edit')}</Button>
        ) : data.length === 0 && editable ? ( */}
        {editable && <AddStationDialog data={sortedData} />}
        {/* ) : null} */}
      </CardHeader>
      <CardContent className="pb-20 pt-16 @container">
        <div className="flex flex-col gap-2 px-20 text-sm text-card-foreground @sm:!flex-row @sm:items-center">
          {data.length > 0 ? (
            sortedData.map((station, index) => (
              <React.Fragment key={station.id}>
                <div className="relative flex size-8 items-center justify-center rounded-full bg-blue-500">
                  <span className="text-white">{station.priority}</span>
                  <span className="absolute left-10 w-40 @sm:left-1/2 @sm:top-12 @sm:-translate-x-1/2 @sm:text-center">
                    {station.name}
                  </span>
                </div>
                {index !== sortedData.length - 1 && (
                  <div className="h-1 flex-1 rounded-full bg-theme-blue-foreground/70"></div>
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
