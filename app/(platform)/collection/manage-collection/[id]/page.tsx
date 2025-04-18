import CollectionColorsTable from '@/components/collection/collection-colors-table';
import CollectionGallery from '@/components/collection/collection-gallery';
import CollectionNotes from '@/components/collection/collection-notes';
import DeleteCollectionDialog from '@/components/collection/delete-collection-dialog';
import ProductStationsStepper from '@/components/collection/product-stations-stepper';
import DescriptionList from '@/components/description-list';
import ImageZoom from '@/components/image-zoom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCollectionDetails } from '@/lib/api-calls';
import { CollectionPingColor, CollectionStatus } from '@/lib/types';
import {
  Images,
  NotebookTabs,
  SlidersVertical,
  SquarePen,
  SwatchBook,
  Waypoints
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
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
      title: t('status'),
      description: (
        <Badge className="-m-1 flex w-max items-center gap-2 rounded-sm border border-border bg-transparent text-foreground">
          <span className="relative flex h-[10px] w-[10px]">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                CollectionPingColor[
                  collectionDetails.status as keyof typeof CollectionPingColor
                ]
              } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex h-[10px] w-[10px] rounded-full ${
                CollectionPingColor[
                  collectionDetails.status as keyof typeof CollectionPingColor
                ]
              }`}
            ></span>
          </span>
          <span>
            {t(
              CollectionStatus[
                collectionDetails.status as keyof typeof CollectionStatus
              ]
            )}
          </span>
        </Badge>
      )
    },
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
      description: collectionDetails.customer.name
    },
    {
      title: t('department'),
      description: collectionDetails.department.name
    },
    {
      title: t('category'),
      description: collectionDetails.category.name
    },
    {
      title: t('season'),
      description: collectionDetails.season.name
    },
    {
      title: t('buyer'),
      description: collectionDetails.buyer
    },
    {
      title: t('size_type'),
      description: collectionDetails.sizeType.name
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
        <Link
          className="ml-auto mr-4"
          href={`/collection/edit-collection/${params.id}`}
        >
          <Button size="sm">
            <SquarePen className="mr-2 size-4" />
            {t('edit')}
          </Button>
        </Link>
        <DeleteCollectionDialog id={params.id} />
      </div>
      <Card className="mb-4 flex flex-col overflow-hidden sm:!flex-row">
        <CardHeader className="flex flex-row items-start border-r ">
          <div className="flex h-full flex-col">
            <div className="flex h-full w-full justify-center p-0">
              <ImageZoom>
                <img
                  src={collectionDetails.image}
                  alt={collectionDetails.name}
                  className="h-52 w-52 rounded object-cover object-top"
                />
              </ImageZoom>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 text-sm">
          <DescriptionList listItems={collectionDetailItems as any} />
        </CardContent>
      </Card>

      <Tabs defaultValue="colors">
        <TabsList>
          <TabsTrigger value="colors">
            <SwatchBook className="mr-2 size-4" />
            {t('colors')}
          </TabsTrigger>
          <TabsTrigger value="product-stations">
            <Waypoints className="mr-2 size-4" />
            {t('product_stations')}
          </TabsTrigger>
          <TabsTrigger value="notes">
            <NotebookTabs className="mr-2 size-4" />
            {t('notes')}
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <Images className="mr-2 size-4" />
            {t('gallery')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="colors">
          <CollectionColorsTable />
        </TabsContent>
        <TabsContent value="product-stations" className="space-y-4">
          <ProductStationsStepper
            editable
            data={collectionDetails.productStations}
          />
        </TabsContent>
        <TabsContent value="notes">
          <CollectionNotes notes={collectionDetails.collectionNotes} />
        </TabsContent>
        <TabsContent value="gallery">
          <CollectionGallery images={collectionDetails.collectionGalleries} />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
}

export default ManageCollectionPage;
