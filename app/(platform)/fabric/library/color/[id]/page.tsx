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
  CopyIcon,
  Info,
  Layers,
  ScrollText
} from 'lucide-react';
// import CollectionCarousel from '@/components/fabric-color/collection-carousel';

async function ColorDetailsPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  const color = await queryClient.fetchQuery({
    queryKey: ['fabric-color', params.id],
    queryFn: async () => {
      const res = await api.get(`/FabricColors/${params.id}`);
      return res.data;
    }
  });

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
          description="Manage users (Client side table functionalities.)"
        />
      </div>
      <Card className="mb-4 flex overflow-hidden md:flex-col lg:flex-row">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="flex h-full flex-col">
            <CardTitle className="group mb-4 flex items-center gap-2 text-lg">
              Fabric Color Details
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <CopyIcon className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription className="flex h-full w-full items-center justify-center">
              <img
                src={color.fabricColorImage}
                className="h-52 w-52 object-cover"
              />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Fabric Color Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Fabric Name</span>
                <span>{color.fabricName}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Fabric Color Name</span>
                <span>{color.fabricColorName}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Fabric Grammage</span>
                <span>{color.fabricGrammage}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Fabric Unit Name</span>
                <span>{color.fabricUnitName}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Fabric Type Name</span>
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
            <CardTitle className="text-sm font-medium">Stock In Hand</CardTitle>
            <Layers />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockInHandCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Orders
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
              Reserved Stock
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
              Summary
              <Popover>
                <PopoverTrigger asChild>
                  <Info size={14} />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm text-muted-foreground">
                    Stock in hand ({stockInHandCount}) + Incoming stock quantity
                    ({activeOrderCount}) - Reserved stock (
                    {color.fabricColorReservedAmount}) = {summary}{' '}
                    {color.fabricUnitName}
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
      <Carousel
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
                    <span className="text-xs text-muted-foreground">Code</span>
                    <span>AM-YA02</span>
                    <span className="text-xs text-muted-foreground">
                      Percent
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
      </Carousel>
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
      {/* <div className="mb-4 grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <Card className="bg-nutural">
          <CardHeader className="px-7">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="italic">
            Stock in hand ({stockInHandCount}) + Incoming stock quantity (
            {activeOrderCount}) - Reserved stock (
            {color.fabricColorReservedAmount}) = {summary}{' '}
            {color.fabricUnitName}
          </CardContent>
        </Card>
      </div> */}
    </HydrationBoundary>
  );
}

export default ColorDetailsPage;
