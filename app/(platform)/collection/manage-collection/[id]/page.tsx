import CollectionGallery from '@/components/collection/collection-gallery';
import CollectionNotes from '@/components/collection/collection-notes';
import ProductStationsStepper from '@/components/collection/product-stations-stepper';
import ThemedZoom from '@/components/themed-zoom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCollectionDetails } from '@/lib/api-calls';
import { getTranslations } from 'next-intl/server';
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

  return (
    <Fragment>
      <div className="mb-4 flex justify-between">
        <Heading
          title={t('manage_collection')}
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
          </div>
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
          <ProductStationsStepper data={collectionDetails.productStations} />
          {/* <ProductStations data={collectionDetails.productStations} /> */}
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
