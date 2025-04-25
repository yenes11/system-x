'use client';

import api from '@/api';
import CollectionColorOrderNotes from '@/components/collection/collection-color-order-notes';
import DeleteCollectionDialog from '@/components/collection/delete-collection-dialog';
import EditCollectionColorOrderSheet from '@/components/collection/edit-collection-color-order';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import ImageZoom from '@/components/image-zoom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Code from '@/components/ui/code';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCollectionOrderDetails } from '@/lib/api-calls';
import { CollectionOrderDetails, OrderStatus } from '@/lib/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ShoppingCart, SquarePen, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import React, { Fragment } from 'react';

function ManageCollectionOrderPage({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const [deleteState, setDeleteState] = React.useState({
    id: params.id,
    open: false
  });

  const details = useSuspenseQuery<CollectionOrderDetails>({
    queryKey: ['collection-order', params.id],
    queryFn: async () => {
      const response = await api.get(`/CollectionColorOrders/${params.id}`);
      return response.data;
    }
  });

  const collection = details.data.collection;
  const order = details.data.order;

  return (
    <Fragment>
      <div className="mb-4 flex justify-between">
        <Heading title={t('manage_order')} icon={<ShoppingCart />} />
        <div>
          <EditCollectionColorOrderSheet state={details.data} />
          {/* <Button variant="secondary" className="mr-2" size="sm">
            <SquarePen className="mr-2 size-4" />
            {t('edit')}
          </Button> */}

          <ConfirmDeleteDialog
            title={t('delete_order')}
            mutationKey={['delete-collection-order', params.id]}
            state={deleteState}
            setState={setDeleteState}
            endpoint="/CollectionColorOrders"
          />
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteState({ open: true, id: params.id })}
          >
            <Trash2 className="mr-2 size-4" />
            {t('delete')}
          </Button>

          {/* <DeleteCollectionDialog id={params.id} /> */}
        </div>
      </div>
      <div className="@container">
        <Card className="mb-4 flex flex-col divide-y overflow-hidden @sm:!flex-row @sm:divide-x @sm:divide-y-0">
          <CardHeader className="bg-muted/50">
            <div className="size-52">
              <ImageZoom>
                <img
                  src={collection.image}
                  className="aspect-square rounded object-cover object-top"
                />
              </ImageZoom>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 gap-24 p-4">
            <div>
              <h2 className="mb-2 font-bold">{t('collection_info')}</h2>
              <dl className="text-sm">
                <dt className="text-xs text-muted-foreground">{t('name')}</dt>
                <dd className="mb-2">{collection.name}</dd>
                <dt className="text-xs text-muted-foreground">{t('color')}</dt>
                <dd className="mb-2">{collection.color}</dd>
                <dt className="text-xs text-muted-foreground">
                  {t('customer')}
                </dt>
                <dd className="mb-2">{collection.customer}</dd>
                <dt className="text-xs text-muted-foreground">
                  {t('customer_code')}
                </dt>
                <dd className="mb-2">
                  <Code>{collection.customerCode}</Code>
                </dd>
                <dt className="text-xs text-muted-foreground">
                  {t('manufacturer_code')}
                </dt>
                <dd>
                  {' '}
                  <Code>{collection.manufacturerCode}</Code>
                </dd>
              </dl>
            </div>
            <div>
              <h2 className="mb-2 font-bold">{t('order_info')}</h2>
              <dl className="text-sm">
                <dt className="text-xs text-muted-foreground">{t('amount')}</dt>
                <dd className="mb-2">{order.amount}</dd>
                <dt className="text-xs text-muted-foreground">{t('plm_id')}</dt>
                <dd className="mb-2">{order.plmId}</dd>
                <dt className="text-xs text-muted-foreground">
                  {t('deadline')}
                </dt>
                <dd className="mb-2">{order.deadline}</dd>
                <dt className="text-xs text-muted-foreground">{t('status')}</dt>
                <dd className="mb-2">{t(OrderStatus[order.status])}</dd>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="body-size">
        <TabsList className="mb-2">
          <TabsTrigger value="body-size">{t('body_size')}</TabsTrigger>

          <TabsTrigger value="fabric">{t('fabric')}</TabsTrigger>
          <TabsTrigger value="material">{t('material')}</TabsTrigger>

          <TabsTrigger value="barcode">{t('barcode')}</TabsTrigger>
          <TabsTrigger value="product-stations">
            {t('product_stations')}
          </TabsTrigger>

          <TabsTrigger value="marker">{t('marker')}</TabsTrigger>
          <TabsTrigger value="notes">{t('notes')}</TabsTrigger>

          <TabsTrigger value="cost-report">{t('cost_report')}</TabsTrigger>
        </TabsList>
        <TabsContent value="fabric">
          {/* <FabricCarousel data={collectionDetails.fabrics} /> */}
        </TabsContent>
        <TabsContent value="material">
          {/* <MaterialCarousel data={collectionDetails.materials} /> */}
        </TabsContent>
        <TabsContent value="notes">
          <CollectionColorOrderNotes />
        </TabsContent>
      </Tabs>

      {/* <ManageColorTabs details={collectionDetails} /> */}
    </Fragment>
  );
}

export default ManageCollectionOrderPage;
