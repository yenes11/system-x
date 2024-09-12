import api from '@/api';
import ActiveOrdersTable from '@/components/fabric-color/active-orders-table';
import IngredientsChart from '@/components/fabric-color/ingredients-chart';
import RecentPricesTable from '@/components/fabric-color/recent-prices-table';
import StocksTable from '@/components/fabric-color/stocks-table';
import SuppliersTable from '@/components/fabric-color/suppliers-table';
import MaterialCollectionsCarousel from '@/components/material/material-collections-caraousel';
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
import { URL_MATERIAL_COLOR } from '@/constants/api-constants';
import { MaterialColor, MaterialUnit } from '@/lib/types';
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
  PaintBucket,
  ScrollText
} from 'lucide-react';
// import CollectionCarousel from '@/components/fabric-color/collection-carousel';

async function getMaterialColor(id: string): Promise<MaterialColor> {
  try {
    const response = await api.get(`${URL_MATERIAL_COLOR}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function ColorDetailsPage({ params }: { params: { id: string } }) {
  const color = await getMaterialColor(params.id);
  const stockInHandCount = color.stocks.reduce(
    (sum: number, item: any) => sum + item.remainingAmount,
    0
  );
  const activeOrderCount = color.activeOrders.reduce(
    (sum: number, item: any) => sum + item.futureOrdersStock,
    0
  );
  const summary = stockInHandCount + activeOrderCount - color.reservedAmount;

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Heading
          title="Color"
          icon={<PaintBucket size={28} className="text-icons" />}
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
              <img src={color.image} className="h-52 w-52 object-cover" />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Fabric Color Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Fabric Name</span>
                <span>{color.materialName}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Fabric Color Name</span>
                <span>{color.name}</span>
              </li>
            </ul>
            {/* <Separator className="my-2" />
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
            </ul> */}
          </div>
        </CardContent>
        {/* <CardFooter className="flex items-center justify-center bg-muted/50 p-0 md:w-72">
          <IngredientsChart data={color.ingredients} />
        </CardFooter> */}
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
            <div className="text-2xl font-bold">{color.reservedAmount}</div>
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
                    {color.reservedAmount}) = {summary} {color.unit}
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
      <MaterialCollectionsCarousel data={color.collectionColors} />
      <div className="mb-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <SuppliersTable data={color.suppliers} />
        <RecentPricesTable id={params.id} />
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <StocksTable
          data={color.stocks}
          fabricUnitName={MaterialUnit[color.unit]}
        />
        <ActiveOrdersTable color={color} />
      </div>
    </>
  );
}

export default ColorDetailsPage;
