import api from '@/api';
import DescriptionList from '@/components/description-list';
import ActiveOrdersTable from '@/components/fabric-color/active-orders-table';
import RecentPricesTable from '@/components/fabric-color/recent-prices-table';
import StocksTable from '@/components/fabric-color/stocks-table';
import SuppliersTable from '@/components/fabric-color/suppliers-table';
import MaterialCollectionsCarousel from '@/components/material/material-collections-caraousel';
import StatusCard from '@/components/status-card';
import ThemedZoom from '@/components/themed-zoom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { URL_MATERIAL_COLOR } from '@/constants/api-constants';
import { getMaterialVariant } from '@/lib/api-calls';
import { MaterialColor, MaterialUnit } from '@/lib/types';
import {
  Blocks,
  ConciergeBell,
  CopyIcon,
  Info,
  Layers,
  PackageCheck,
  PaintBucket,
  ReceiptText,
  ScrollText,
  ShoppingBasket
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
// import CollectionCarousel from '@/components/fabric-color/collection-carousel';

async function ColorDetailsPage({ params }: { params: { id: string } }) {
  const color = await getMaterialVariant(params.id);
  const t = await getTranslations();
  const stockInHandCount = color.stocks.reduce(
    (sum: number, item: any) => sum + item.remainingAmount,
    0
  );
  const activeOrderCount = color.activeOrders.reduce(
    (sum: number, item: any) => sum + item.futureOrdersStock,
    0
  );
  const summary = stockInHandCount + activeOrderCount - color.reservedAmount;

  const listItems = [
    {
      title: t('name'),
      description: color.materialName
    },
    {
      title: t('size'),
      description: color.size
    },
    {
      title: t('type'),
      description: color.type.name
    },
    {
      title: t('identity_unit'),
      description: color.type.identityUnit
    },
    {
      title: t('order_unit'),
      description: color.type.orderUnit
    },
    {
      title: t('variant_unit'),
      description: color.type.variantUnit
    }
  ];

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Heading
          title={t('material_color_variant')}
          icon={<PaintBucket size={28} className="text-icons" />}
        />
      </div>
      <div className="@container">
        <Card className="mb-4 flex flex-col overflow-hidden @sm:!flex-row">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="flex h-full flex-col">
              <ThemedZoom>
                <img
                  src={color.image}
                  className="h-52 w-52 rounded object-cover object-top"
                />
              </ThemedZoom>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 text-sm">
            {/* <div className="grid gap-3">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('name')}</span>
                <span>{color.materialName}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('size')}</span>
                <span>{color.size}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('type')}</span>
                <span>{color.type.name}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('identity_unit')}
                </span>
                <span>{color.type.identityUnit}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('order_unit')}</span>
                <span>{color.type.orderUnit}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('variant_unit')}
                </span>
                <span>{color.type.variantUnit}</span>
              </li>
            </ul>
          </div> */}
            <DescriptionList listItems={listItems} />
          </CardContent>
        </Card>
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title={t('stock_in_hand')}
          value={stockInHandCount}
          icon={PackageCheck}
        />
        <StatusCard
          title={t('upcoming_orders')}
          value={activeOrderCount}
          icon={ShoppingBasket}
        />
        <StatusCard
          title={t('reserved_stock')}
          value={color.reservedAmount}
          icon={Blocks}
        />

        <Card>
          <CardContent className="flex h-full items-center gap-4 p-4">
            <span className="rounded-lg bg-theme-blue/10 p-4 text-theme-blue-foreground">
              <ReceiptText />
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                {t('summary')}
                <Popover>
                  <PopoverTrigger className="h4 flex w-4 items-center">
                    <Info size={12} />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-muted-foreground">
                      {t('stock_in_hand')} ({stockInHandCount}) +{' '}
                      {t('incoming_stock')} ({activeOrderCount}) -{' '}
                      {t('reserved_stock')} ({color.reservedAmount}) = {summary}{' '}
                      {color.type.variantUnit}
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-2xl font-bold">{summary}</div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stock_in_hand')}
            </CardTitle>
            <Layers />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockInHandCount}</div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('upcoming_orders')}
            </CardTitle>
            <Blocks />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrderCount}</div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('reserved_stock')}
            </CardTitle>
            <ConciergeBell />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{color.reservedAmount}</div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              {t('summary')}
              <Popover>
                <PopoverTrigger asChild>
                  <Info size={14} />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm text-muted-foreground">
                    {t('stock_in_hand')} ({stockInHandCount}) +{' '}
                    {t('incoming_stock')} ({activeOrderCount}) -{' '}
                    {t('reserved_stock')} ({color.reservedAmount}) = {summary}{' '}
                  </p>
                </PopoverContent>
              </Popover>
            </CardTitle>
            <ScrollText />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary}</div>
          </CardContent>
        </Card> */}
      </div>
      {color?.collectionColors?.length > 0 && (
        <MaterialCollectionsCarousel data={color.collectionColors} />
      )}

      <Tabs defaultValue="suppliers" className="">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suppliers">{t('suppliers')}</TabsTrigger>
          <TabsTrigger value="prices">{t('recent_prices')}</TabsTrigger>
          <TabsTrigger value="stocks">{t('stocks')}</TabsTrigger>
          <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
        </TabsList>
        <TabsContent value="suppliers">
          <SuppliersTable data={color.suppliers} />
        </TabsContent>
        <TabsContent value="prices">
          <RecentPricesTable id={params.id} />
        </TabsContent>
        <TabsContent value="stocks">
          <StocksTable data={color.stocks} fabricUnitName={''} />
        </TabsContent>
        <TabsContent value="orders">
          <ActiveOrdersTable color={color} />
        </TabsContent>
      </Tabs>

      {/* 
      <div className="mb-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <SuppliersTable data={color.suppliers} />
        <RecentPricesTable id={params.id} />
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <StocksTable data={color.stocks} fabricUnitName={''} />
        <ActiveOrdersTable color={color} />
      </div> */}
    </>
  );
}

export default ColorDetailsPage;
