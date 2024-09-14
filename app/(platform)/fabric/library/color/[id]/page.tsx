import api from '@/api';
import ActiveOrdersTable from '@/components/fabric-color/active-orders-table';
import IngredientsChart from '@/components/fabric-color/ingredients-chart';
import RecentPricesTable from '@/components/fabric-color/recent-prices-table';
import StocksTable from '@/components/fabric-color/stocks-table';
import SuppliersTable from '@/components/fabric-color/suppliers-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Heading } from '@/components/ui/heading';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import {
  Blocks,
  ConciergeBell,
  Copy,
  CopyIcon,
  Info,
  Layers,
  PaintBucket,
  ScrollText
} from 'lucide-react';
import { getMessages, getTranslations } from 'next-intl/server';
import ImageViewer from '@/components/image-viewer';
import FabricColorCollectionCarousel from '@/components/fabric-color/fabric-color-collection-caraousel';
// import CollectionCarousel from '@/components/fabric-color/collection-carousel';

async function ColorDetailsPage({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  const queryClient = new QueryClient();
  const color = await queryClient.fetchQuery({
    queryKey: ['fabric-color', params.id],
    queryFn: async () => {
      const res = await api.get(`/FabricColors/${params.id}`);
      return res.data;
    }
  });

  console.log(color.collectionColors);

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mb-4 flex justify-between">
        <Heading
          title="Color"
          icon={<PaintBucket size={24} className="text-icon" />}
        />
      </div>
      <Card className="mb-4 flex overflow-hidden md:flex-col lg:flex-row">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="flex h-full flex-col">
            <div className="flex h-full w-full items-center justify-center p-0">
              {/* <Image
                width={208}
                height={208}
                src={color.fabricColorImage}
                className="rounded object-cover"
              /> */}
              <ImageViewer src={color.fabricColorImage} alt="color" />
              {/* <img
                src={color.fabricColorImage}
                className="h-52 w-52 rounded object-cover"
              /> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 text-sm">
          <div className="grid gap-3">
            <div className="text-lg font-semibold">
              {t('fabric_color_details')}
            </div>
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
            <Separator className="my-2" />
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
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center bg-muted/50 p-0 md:w-72">
          <IngredientsChart data={color.ingredients} />
        </CardFooter>
      </Card>
      <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stock_in_hand')}
            </CardTitle>
            <Layers />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockInHandCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('upcoming_orders')}
            </CardTitle>
            <Blocks />
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
            <ConciergeBell />
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
                <PopoverTrigger asChild>
                  <Info size={14} />
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
            <ScrollText />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary}</div>
          </CardContent>
        </Card>
      </div>
      {/* <Carousel
        opts={{
          align: 'start'
        }}
        className="m-auto mb-4 min-w-0 max-w-full"
      >
        <CarouselContent>
          {Array.from({ length: 50 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/5"
            >
              <div className="p-1">
                <Card className="overflow-hidden bg-cover bg-center p-0">
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-0">
                    <img
                      src="https://cdn.dsmcdn.com/mnresize/1200/1800/ty1398/product/media/images/prod/PIM/20240703/14/da7794de-1bb2-41f9-b649-925e6ebc4df2/1_org_zoom.jpg"
                      className="positio aspect-square w-full origin-top-left object-cover object-top"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-2">
                    <span className="text-xs text-muted-foreground">
                      {t('code')}
                    </span>
                    <div
                      className="flex items-center gap-2"
                      // onClick={() => {
                      //   navigator.clipboard.writeText('AM-YA02');
                      // }}
                    >
                      <span>AM-YA02</span>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy Order ID</span>
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {t('percentage')}
                    </span>
                    <span>82%</span>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> */}
      <FabricColorCollectionCarousel data={color.collectionColors} />
      <div className="mb-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <SuppliersTable data={color.suppliers} />
        <RecentPricesTable id={params.id} />
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <StocksTable
          data={color.stocks}
          fabricUnitName={color.fabricUnitName}
        />
        <ActiveOrdersTable color={color} />
      </div>
    </HydrationBoundary>
  );
}

export default ColorDetailsPage;
