import CollectionGallery from '@/components/collection/collection-gallery';
import CollectionNotes from '@/components/collection/collection-notes';
import ProductStationsStepper from '@/components/collection/product-stations-stepper';
import DescriptionList from '@/components/description-list';
import ThemedZoom from '@/components/themed-zoom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCollectionDetails } from '@/lib/api-calls';
import { SlidersVertical } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Fragment } from 'react';
// import CollectionCarousel from '@/components/fabric-color/collection-carousel';

const collectionDetailItems = [
  {
    title: 'name',
    key: 'name'
  },
  {
    title: 'description',
    key: 'description'
  },
  {
    title: 'customer_code',
    key: 'customerCode'
  },
  {
    title: 'manufacturer_code',
    key: 'manufacturerCode'
  },
  {
    title: 'customer',
    key: 'customer'
  },
  {
    title: 'department',
    key: 'department'
  },
  {
    title: 'category',
    key: 'category'
  },
  {
    title: 'season',
    key: 'season'
  },
  {
    title: 'buyer',
    key: 'buyer'
  },
  {
    title: 'size_type',
    key: 'sizeType'
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
  }
];

async function ManageCollectionPage({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  const collectionDetails = await getCollectionDetails(params.id);

  const collectionDetailItems = [
    {
      title: t('name'),
      description: collectionDetails.name
    },
    {
      title: t('description'),
      description: collectionDetails.description
    },
    {
      title: t('customer_code'),
      description: collectionDetails.customerCode
    },
    {
      title: t('manufacturer_code'),
      description: collectionDetails.manufacturerCode
    },
    {
      title: t('customer'),
      description: collectionDetails.customer
    },
    {
      title: t('department'),
      description: collectionDetails.department
    },
    {
      title: t('category'),
      description: collectionDetails.category
    },
    {
      title: t('season'),
      description: collectionDetails.season
    },
    {
      title: t('buyer'),
      description: collectionDetails.buyer
    },
    {
      title: t('size_type'),
      description: collectionDetails.sizeType
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
    }
  ];

  return (
    <Fragment>
      <div className="mb-4 flex justify-between">
        <Heading title={t('manage_collection')} icon={<SlidersVertical />} />
      </div>
      <Card className="mb-4 flex flex-col overflow-hidden sm:!flex-row">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="flex h-full flex-col">
            <div className="flex h-full w-full justify-center p-0">
              <ThemedZoom>
                <Image
                  src={collectionDetails.image}
                  alt={collectionDetails.name}
                  width={208}
                  height={208}
                  objectFit="cover"
                  className="h-52 w-52 rounded object-cover object-top"
                />
              </ThemedZoom>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 text-sm">
          <DescriptionList listItems={collectionDetailItems as any} />
          {/* <div className="grid gap-3">
            <ul className="grid gap-3">
              {collectionDetailItems.map((item) => (
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

      <Tabs defaultValue="product-stations" className="space-y-4">
        <TabsList className="flex">
          <TabsTrigger className="flex-1" value="product-stations">
            {t('product_stations')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="notes">
            {t('notes')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="gallery">
            {t('gallery')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="product-stations" className="space-y-4">
          <ProductStationsStepper
            editable
            data={collectionDetails.productStations}
          />
        </TabsContent>
        <TabsContent value="notes" className="">
          <CollectionNotes notes={collectionDetails.collectionNotes} />
        </TabsContent>
        <TabsContent value="gallery" className="">
          <CollectionGallery images={collectionDetails.collectionGalleries} />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
}

export default ManageCollectionPage;
