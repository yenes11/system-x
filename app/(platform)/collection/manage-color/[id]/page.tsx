'use client';

import FabricCarousel from '@/components/collection/fabric-carousel';
import ManageColorTabs from '@/components/collection/manage-color-tabs';
import MaterialCarousel from '@/components/collection/material-carousel';
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
  AlertCircle,
  BadgeCheck,
  SquareBottomDashedScissors
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

function ManageCollectionColorPage({ params }: { params: { id: string } }) {
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
          title={t('manage_color')}
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
          <div className="flex gap-2">
            <AlertCircle />
            <span className="font-medium">{t('unverified')}</span>
            {/* <p className="">{t('unverified_description')}</p> */}
          </div>
          <div className="ml-auto">
            <VerifyCollectionDialog details={collectionDetails} />
          </div>
        </div>
      )}
      <div className="@container">
        <Card className="mb-4 flex flex-col divide-y overflow-hidden @sm:!flex-row @sm:divide-x @sm:divide-y-0">
          <CardHeader className="bg-muted/50">
            <div className="size-52">
              <ImageZoom>
                <img
                  src={collectionDetails.image}
                  className="aspect-square rounded object-cover object-top"
                />
              </ImageZoom>
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
          <FabricCarousel data={collectionDetails.fabrics} />
        </TabsContent>
        <TabsContent value="material">
          <MaterialCarousel data={collectionDetails.materials} />
        </TabsContent>
      </Tabs>

      <ManageColorTabs details={collectionDetails} />
    </Fragment>
  );
}

export default ManageCollectionColorPage;
