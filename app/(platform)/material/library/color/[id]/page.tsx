import DescriptionList from '@/components/description-list';
import ActiveOrdersTable from '@/components/fabric-color/active-orders-table';
import RecentPricesTable from '@/components/fabric-color/recent-prices-table';
import ReservedStockStatusCard from '@/components/fabric-color/reserved-stock-status-card';
import StocksTable from '@/components/fabric-color/stocks-table';
import SuppliersTable from '@/components/fabric-color/suppliers-table';
import ImageZoom from '@/components/image-zoom';
import MaterialCollectionsCarousel from '@/components/material/material-collections-caraousel';
import StatusCard from '@/components/status-card';
import ThemedZoom from '@/components/themed-zoom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMaterialVariant } from '@/lib/api-calls';
import {
  Blocks,
  Info,
  Package,
  PackageCheck,
  PaintBucket,
  ReceiptText,
  ShoppingBasket,
  ShoppingCart,
  Tag
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

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
              <ImageZoom>
                <img
                  src={color.image}
                  className="h-52 w-52 rounded object-cover object-top"
                />
              </ImageZoom>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 text-sm">
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
        {/* <StatusCard
          title={t('reserved_stock')}
          value={color.reservedAmount}
          icon={Blocks}
        /> */}

        <ReservedStockStatusCard
          unit={color.size}
          value={color.reservedAmount}
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
      </div>
      {color?.collectionColors?.length > 0 && (
        <MaterialCollectionsCarousel data={color.collectionColors} />
      )}

      <Tabs defaultValue="suppliers" className="">
        <TabsList>
          <TabsTrigger value="suppliers">
            <Blocks className="mr-2 size-4" />
            {t('suppliers')}
          </TabsTrigger>
          <TabsTrigger value="prices">
            <Tag className="mr-2 size-4" />
            {t('recent_prices')}
          </TabsTrigger>
          <TabsTrigger value="stocks">
            <Package className="mr-2 size-4" />
            {t('stocks')}
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="mr-2 size-4" />
            {t('orders')}
          </TabsTrigger>
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
    </>
  );
}

export default ColorDetailsPage;
