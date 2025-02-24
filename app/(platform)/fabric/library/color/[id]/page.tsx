import CustomZoom from '@/components/custom-zoom';
import DescriptionList from '@/components/description-list';
import ActiveOrdersTable from '@/components/fabric-color/active-orders-table';
import FabricColorCollectionCarousel from '@/components/fabric-color/fabric-color-collection-caraousel';
import IngredientsChart from '@/components/fabric-color/ingredients-chart';
import RecentPricesTable from '@/components/fabric-color/recent-prices-table';
import ReservedStockStatusCard from '@/components/fabric-color/reserved-stock-status-card';
import StocksTable from '@/components/fabric-color/stocks-table';
import SuppliersTable from '@/components/fabric-color/suppliers-table';
import ImageZoom from '@/components/image-zoom';
import StatusCard from '@/components/status-card';
import ThemedZoom from '@/components/themed-zoom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFabricColorDetail } from '@/lib/api-calls';
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
import Image from 'next/image';
// import CollectionCarousel from '@/components/fabric-color/collection-carousel';

const listItems = [
  {
    title: 'fabric_name',
    key: 'fabricName'
  },
  {
    title: 'name',
    key: 'fabricColorName'
  },
  {
    title: 'grammage',
    key: 'fabricGrammage'
  },
  {
    title: 'unit',
    key: 'fabricUnitName'
  },
  {
    title: 'type',
    key: 'fabricTypeName'
  }
];

async function ColorDetailsPage({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  const color = await getFabricColorDetail(params.id);

  const descriptionListItems = listItems.map((i) => ({
    title: t(i.title),
    description: color[i.key as keyof typeof color]
  }));

  const stockInHandCount = color.stocks.reduce(
    (sum: number, item: any) => sum + item.remainingAmount,
    0
  );
  const activeOrderCount = color.activeOrders.reduce(
    (sum: number, item: any) => sum + item.futureOrdersStock,
    0
  );
  const summary =
    stockInHandCount + activeOrderCount - color.fabricColorReservedAmount;

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Heading title={t('fabric_color')} icon={<PaintBucket />} />
      </div>
      <div className="@container">
        <Card className="mb-4 flex flex-col divide-x overflow-hidden @md:!flex-row @md:divide-y-0">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="flex h-full flex-col">
              <div className="flex h-full w-full items-center justify-center p-0">
                <ImageZoom>
                  <Image
                    width={208}
                    height={208}
                    src={color.fabricColorImage}
                    alt="Color cover"
                    objectFit="cover"
                    className="h-52 w-52 rounded"
                  />
                </ImageZoom>
                {/* <img
                    src={color.fabricColorImage}
                    className="h-52 w-52 rounded object-cover"
                  /> */}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 text-sm">
            <DescriptionList listItems={descriptionListItems as any} />
          </CardContent>
          <CardFooter className="flex w-full items-center justify-center bg-muted/50 p-0 @md:w-72">
            <IngredientsChart data={color.ingredients} />
          </CardFooter>
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
          value={color.fabricColorReservedAmount}
          icon={Blocks}
        /> */}
        <ReservedStockStatusCard
          unit={color.fabricUnitName}
          value={color.fabricColorReservedAmount}
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
                      {t('reserved_stock')} ({color.fabricColorReservedAmount})
                      = {summary} {color.fabricUnitName}
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-2xl font-bold">{summary}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      {color?.collectionColors.length > 0 && (
        <FabricColorCollectionCarousel data={color.collectionColors} />
      )}
      <Tabs defaultValue="suppliers" className="">
        <TabsList className="">
          <TabsTrigger value="suppliers">
            <Blocks className="mr-2 size-5" />
            {t('suppliers')}
          </TabsTrigger>
          <TabsTrigger value="prices">
            <Tag className="mr-2 size-5" />
            {t('recent_prices')}
          </TabsTrigger>
          <TabsTrigger value="stocks">
            <Package className="mr-2 size-5" />
            {t('stocks')}
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="mr-2 size-5" />
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
          <StocksTable
            data={color.stocks}
            fabricUnitName={color.fabricUnitName}
          />
        </TabsContent>
        <TabsContent value="orders">
          <ActiveOrdersTable color={color} />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default ColorDetailsPage;
