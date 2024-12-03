import CustomZoom from '@/components/custom-zoom';
import DescriptionList from '@/components/description-list';
import ActiveOrdersTable from '@/components/fabric-color/active-orders-table';
import FabricColorCollectionCarousel from '@/components/fabric-color/fabric-color-collection-caraousel';
import IngredientsChart from '@/components/fabric-color/ingredients-chart';
import RecentPricesTable from '@/components/fabric-color/recent-prices-table';
import StocksTable from '@/components/fabric-color/stocks-table';
import SuppliersTable from '@/components/fabric-color/suppliers-table';
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
  PackageCheck,
  PaintBucket,
  ReceiptText,
  ShoppingBasket
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
        <Card className="mb-4 flex flex-col overflow-hidden @md:!flex-row">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="flex h-full flex-col">
              <div className="flex h-full w-full items-center justify-center p-0">
                <ThemedZoom>
                  <Image
                    width={208}
                    height={208}
                    src={color.fabricColorImage}
                    alt="Color cover"
                    objectFit="cover"
                    className="h-52 w-52 rounded"
                  />
                </ThemedZoom>
                {/* <img
                    src={color.fabricColorImage}
                    className="h-52 w-52 rounded object-cover"
                  /> */}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 text-sm">
            {/* <div className="grid gap-3">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('fabric_name')}
                </span>
                <span>{color.fabricName}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('name')}</span>
                <span>{color.fabricColorName}</span>
              </li>
            </ul>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('grammage')}</span>
                <span>{color.fabricGrammage}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('unit')}</span>
                <span>{color.fabricUnitName}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('type')}</span>
                <span>{color.fabricTypeName}</span>
              </li>
            </ul>
          </div> */}
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
        <StatusCard
          title={t('reserved_stock')}
          value={color.fabricColorReservedAmount}
          icon={Blocks}
        />
        {/* <StatusCard
          title={t('summary')}
          value={summary}
          icon={<ReceiptText />}
        /> */}

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

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stock_in_hand')}
            </CardTitle>
            <Icon icon="archive" size={22} />
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
            <Icon icon="basket" size={22} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrderCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('reserved_stock')}
            </CardTitle>
            <Icon icon="notification" size={22} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {color.fabricColorReservedAmount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              {t('summary')}
              <Popover>
                <PopoverTrigger className="h4 flex w-4 items-center">
                  <Icon icon="information-2" size={14} />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm text-muted-foreground">
                    {t('stock_in_hand')} ({stockInHandCount}) +{' '}
                    {t('incoming_stock')} ({activeOrderCount}) -{' '}
                    {t('reserved_stock')} ({color.fabricColorReservedAmount}) ={' '}
                    {summary} {color.fabricUnitName}
                  </p>
                </PopoverContent>
              </Popover>
            </CardTitle>
            <Icon icon="scroll" size={22} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary}</div>
          </CardContent>
        </Card> */}
      </div>
      {color?.collectionColors.length > 0 && (
        <FabricColorCollectionCarousel data={color.collectionColors} />
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
