'use client';

import CostTable from '@/components/collection/cost-table';
import FabricCarousel from '@/components/collection/fabric-carousel';
import MaterialCarousel from '@/components/collection/material-carousel';
import ProductStationsStepper from '@/components/collection/product-stations-stepper';
import SamplesTable from '@/components/collection/samples-table';
import VerifyCollectionDialog from '@/components/collection/verify-collection-dialog';
import DescriptionList from '@/components/description-list';
import ImageZoom from '@/components/image-zoom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCollectionDraftDetails } from '@/lib/api-calls';
import { useCollectionSlice } from '@/store/collection-slice';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  BadgeCheck,
  Banknote,
  Paperclip,
  SquareBottomDashedScissors,
  Waypoints
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

function ManageCollectionPage({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const setCurrentCollectionColor = useCollectionSlice(
    (state) => state.setCurrentCollectionColor
  );
  // const collectionDetails = await getCollectionDraftDetails(params.id);

  const { data: collectionDetails } = useSuspenseQuery({
    queryKey: ['collection-color', params.id],
    queryFn: async () => {
      const data = await getCollectionDraftDetails(params.id);
      setCurrentCollectionColor(data);
      return data;
    }
  });

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
      <div className="mb-2 flex justify-between">
        <Heading
          title={t('manage_draft')}
          icon={<SquareBottomDashedScissors />}
        />
        {collectionDetails.identityDefined && (
          <div className="flex items-center gap-1 text-green-500">
            <BadgeCheck className="size-5" />
            {t('verified')}
          </div>
        )}
      </div>
      {!collectionDetails.identityDefined && (
        <div className="mb-3 flex items-center gap-2 rounded-md border-l-destructive bg-destructive/15 px-4 py-2 text-destructive">
          <div>
            <span className="text-sm font-medium">{t('unverified')}</span>
            {/* <p className="text-xs">{t('unverified_description')}</p> */}
          </div>
          <div className="ml-auto">
            <VerifyCollectionDialog details={collectionDetails} />
          </div>
        </div>
      )}
      <div className="@container">
        <Card className="mb-4 flex flex-col divide-y overflow-hidden @sm:!flex-row @sm:divide-x @sm:divide-y-0">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="flex h-full flex-col">
              <div className="flex h-full w-full justify-center p-0">
                <ImageZoom>
                  <img
                    src={collectionDetails.image}
                    className="h-52 w-52 rounded object-cover object-top"
                  />
                </ImageZoom>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 text-sm">
            <DescriptionList listItems={listItems} />
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
          <FabricCarousel
            verified={collectionDetails.identityDefined}
            data={collectionDetails.fabrics}
          />
        </TabsContent>
        <TabsContent value="material">
          <MaterialCarousel data={collectionDetails.materials} />
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="product-stations">
        <TabsList className="mb-2">
          <TabsTrigger className="flex-1" value="product-stations">
            <Waypoints className="mr-2 size-4" />
            {t('product_stations')}
          </TabsTrigger>

          <TabsTrigger className="flex-1" value="samples">
            <Paperclip className="mr-2 size-4" />
            {t('samples')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="costs">
            <Banknote className="mr-2 size-4" />
            {t('costs')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="product-stations">
          <ProductStationsStepper
            editable={false}
            data={collectionDetails.productStations}
          />
        </TabsContent>
        <TabsContent value="samples">
          <SamplesTable />
        </TabsContent>
        <TabsContent value="costs">
          <CostTable />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
}

export default ManageCollectionPage;
