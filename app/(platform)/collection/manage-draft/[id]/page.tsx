import FabricCarousel from '@/components/collection/fabric-carousel';
import MaterialCarousel from '@/components/collection/material-carousel';
import ProductStationsStepper from '@/components/collection/product-stations-stepper';
import SamplesTable from '@/components/collection/samples-table';
import DescriptionList from '@/components/description-list';
import ThemedZoom from '@/components/themed-zoom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCollectionDraftDetails } from '@/lib/api-calls';
import { BadgeCheck, Check, SquareBottomDashedScissors } from 'lucide-react';
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

  const listItems = [
    {
      title: t('collection_name'),
      description: collectionDetails.collectionName
    },
    {
      title: t('description'),
      description: collectionDetails.description
    },
    {
      title: t('collection_color'),
      description: collectionDetails.collectionColor
    },
    {
      title: t('customer_department'),
      description: collectionDetails.customerDepartmentName
    },
    {
      title: t('category'),
      description: collectionDetails.categoryName
    },
    {
      title: t('customer_season'),
      description: collectionDetails.customerSeasonName
    },
    {
      title: t('buyer'),
      description: collectionDetails.buyer
    },
    {
      title: t('size_type'),
      description: collectionDetails.sizeTypeName
    },
    {
      title: t('garment_1'),
      description: collectionDetails.garment1
    },
    {
      title: t('garment_2'),
      description: collectionDetails.garment2
    },
    {
      title: t('designer'),
      description: collectionDetails.designer
    },
    {
      title: t('customer_code'),
      description: collectionDetails.customerCode
    },
    {
      title: t('manufacturer_code'),
      description: collectionDetails.manufacturerCode
    }
  ];

  return (
    <Fragment>
      <div className="mb-4 flex justify-between">
        <Heading
          title={t('manage_draft')}
          icon={<SquareBottomDashedScissors />}
        />
        <div className="flex items-center gap-1 rounded  py-1">
          <BadgeCheck className="size-5" />
          Verified
        </div>
      </div>
      <div className="@container">
        <Card className="mb-4 flex flex-col overflow-hidden @sm:!flex-row">
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
          <CardContent className="flex-1 p-0 text-sm">
            <DescriptionList listItems={listItems} />
            {/* <div className="grid gap-3">
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
          </div> */}
          </CardContent>
        </Card>
      </div>
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

      <Tabs defaultValue="product-stations">
        <TabsList className="mb-2 flex">
          <TabsTrigger className="flex-1" value="product-stations">
            {t('product_stations')}
          </TabsTrigger>

          <TabsTrigger className="flex-1" value="samples">
            {t('samples')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="costs">
            {t('costs')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="size-and-barcode">
            {t('size_and_barcode')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="product-stations">
          <ProductStationsStepper data={collectionDetails.productStations} />
        </TabsContent>
        <TabsContent value="samples">
          <SamplesTable />
        </TabsContent>
        <TabsContent value="costs">empty</TabsContent>
        <TabsContent value="size-and-barcode">empty</TabsContent>
      </Tabs>
    </Fragment>
  );
}

export default ManageCollectionPage;
