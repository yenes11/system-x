'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTranslations } from 'next-intl';
import SuppliersTable from './suppliers-table';
import { useParams } from 'next/navigation';
import RecentPricesTable from './recent-prices-table';
import StocksTable from './stocks-table';
import ActiveOrdersTable from './active-orders-table';

type FabricColorTab = 'suppliers' | 'prices' | 'stocks' | 'orders';
interface Props {
  data: any;
}

function FabricColorTableTabs({ data }: Props) {
  const [curretTab, setCurrentTab] = useState<FabricColorTab>('suppliers');
  const t = useTranslations();
  const params = useParams();

  return (
    <Tabs defaultValue="suppliers" className="">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="suppliers">{t('suppliers')}</TabsTrigger>
        <TabsTrigger value="prices">{t('recent_prices')}</TabsTrigger>
        <TabsTrigger value="stocks">{t('stocks')}</TabsTrigger>
        <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
      </TabsList>
      <TabsContent value="suppliers">
        <SuppliersTable data={data.suppliers} />
      </TabsContent>
      <TabsContent value="prices">
        <RecentPricesTable id={params.id as string} />
      </TabsContent>
      <TabsContent value="stocks">
        <StocksTable data={data.stocks} fabricUnitName={data.fabricUnitName} />
      </TabsContent>
      <TabsContent value="orders">
        <ActiveOrdersTable color={data} />
      </TabsContent>
    </Tabs>
  );
}

export default FabricColorTableTabs;
