'use client';

import {
  Banknote,
  Paperclip,
  QrCode,
  ShoppingCart,
  Waypoints
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTranslations } from 'next-intl';
import ThemedTooltip from '../ThemedTooltip';
import ProductStationsStepper from './product-stations-stepper';
import SamplesTable from './samples-table';
import CostTable from './cost-table';
import { CollectionDraft } from '@/lib/types';
import React from 'react';
import SizeAndBarcodeTable from './size-and-barcode-table';
import CollectionColorOrdersTable from './collection-color-orders-table';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface Props {
  details: CollectionDraft;
}

function ManageColorTabs({ details }: Props) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = React.useState('product-stations');

  return (
    <Tabs
      onValueChange={(value) => {
        if (!details.identityDefined && value === 'size-and-barcode') return;
        setActiveTab(value);
      }}
      value={activeTab}
      defaultValue="product-stations"
    >
      <ScrollArea>
        <TabsList className="mb-2">
          <TabsTrigger className="flex-1" value="product-stations">
            <Waypoints className="mr-2 size-4" />
            {t('product_stations')}
          </TabsTrigger>

          <TabsTrigger className="flex-1" value="samples">
            <Paperclip className="mr-2 size-4" />
            {t('samples')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="costs">
            <Banknote className="mr-2 size-4" />
            {t('costs')}
          </TabsTrigger>
          <ThemedTooltip
            disabled={details.identityDefined}
            disableHoverableContent={!details.identityDefined}
            text="identity_required_message"
          >
            <TabsTrigger
              value="size-and-barcode"
              className={!details.identityDefined ? 'opacity-50' : ''}
            >
              <QrCode className="mr-2 size-4" />
              {t('size_and_barcode')}
            </TabsTrigger>
          </ThemedTooltip>
          <TabsTrigger className="flex-1" value="orders">
            <ShoppingCart className="mr-2 size-4" />
            {t('orders')}
          </TabsTrigger>
        </TabsList>
        <ScrollBar className="h-0" orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="product-stations">
        <ProductStationsStepper data={details.productStations} />
      </TabsContent>
      <TabsContent value="samples">
        <SamplesTable isVerified={details.identityDefined} />
      </TabsContent>
      <TabsContent value="costs">
        <CostTable />
      </TabsContent>
      <TabsContent value="size-and-barcode">
        <SizeAndBarcodeTable />
      </TabsContent>
      <TabsContent value="orders">
        <CollectionColorOrdersTable identityDefined={details.identityDefined} />
      </TabsContent>
    </Tabs>
  );
}

export default ManageColorTabs;
