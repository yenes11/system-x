import api from '@/api';
import CollectionGallery from '@/components/collection/collection-gallery';
import CollectionNotes from '@/components/collection/collection-notes';
import FabricCarousel from '@/components/collection/fabric-carousel';
import MaterialCarousel from '@/components/collection/material-carousel';
import ProductStations from '@/components/collection/product-stations';
import ProductStationsStepper from '@/components/collection/product-stations-stepper';
import ActiveOrdersTable from '@/components/fabric-color/active-orders-table';
import FabricColorCollectionCarousel from '@/components/fabric-color/fabric-color-collection-caraousel';
import IngredientsChart from '@/components/fabric-color/ingredients-chart';
import RecentPricesTable from '@/components/fabric-color/recent-prices-table';
import StocksTable from '@/components/fabric-color/stocks-table';
import SuppliersTable from '@/components/fabric-color/suppliers-table';
import ThemedZoom from '@/components/themed-zoom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getCollectionDetails,
  getCollectionDraftDetails
} from '@/lib/api-calls';
import { CollectionDetails } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import {
  Blocks,
  ConciergeBell,
  Info,
  Layers,
  PaintBucket,
  ScrollText
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Fragment } from 'react';
// import CollectionCarousel from '@/components/fabric-color/collection-carousel';

const collectionDraftItems = [
  {
    title: 'collection_name',
    key: 'collectionName'
  },
  {
    title: 'description',
    key: 'description'
  },
  {
    title: 'collection_color',
    key: 'collectionColor'
  },
  {
    title: 'customer_department',
    key: 'customerDepartmentName'
  },
  {
    title: 'category',
    key: 'categoryName'
  },
  {
    title: 'customer_season',
    key: 'customerSeasonName'
  },
  {
    title: 'buyer',
    key: 'buyer'
  },
  {
    title: 'size_type',
    key: 'sizeTypeName'
  },
  {
    title: 'garment_1',
    key: 'garment1'
  },
  {
    title: 'garment_2',
    key: 'garment2'
  },
  {
    title: 'designer',
    key: 'designer'
  },
  {
    title: 'customer_code',
    key: 'customerCode'
  },
  {
    title: 'manufacturer_code',
    key: 'manufacturerCode'
  }
];

async function ManageCollectionPage({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  const collectionDetails = await getCollectionDraftDetails(params.id);

  return (
    <Fragment>
      <div className="mb-4 flex justify-between">
        <Heading
          title={t('manage_draft')}
          icon={<Icon icon="colors-square" currentColor size={32} />}
        />
      </div>
      <Card className="mb-4 flex overflow-hidden md:flex-col lg:flex-row">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="flex h-full flex-col">
            <div className="flex h-full w-full justify-center p-0">
              <ThemedZoom>
                <img
                  src={collectionDetails.image}
                  className="h-52 w-52 rounded object-cover object-top"
                />
              </ThemedZoom>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 text-sm">
          <div className="grid gap-3">
            <div className="text-lg font-semibold">
              {t('collection_details')}
            </div>
            <ul className="grid gap-3">
              {collectionDraftItems.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-muted-foreground">{t(item.title)}</span>
                  <span>{(collectionDetails as any)[item.key] ?? `−`}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fabric">
        <TabsList className="mb-2">
          <TabsTrigger className="w-44" value="fabric">
            {t('fabric')}
          </TabsTrigger>

          <TabsTrigger className="w-44" value="material">
            {t('material')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fabric">
          <FabricCarousel data={collectionDetails.fabrics} />
        </TabsContent>
        <TabsContent value="material">
          <MaterialCarousel data={collectionDetails.materials} />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
}

export default ManageCollectionPage;
