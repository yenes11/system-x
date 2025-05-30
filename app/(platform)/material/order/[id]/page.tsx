import ImageZoom from '@/components/image-zoom';
import StockTable from '@/components/order/stock-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Code from '@/components/ui/code';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMaterialOrderDetails } from '@/lib/api-calls';
import { currencyEnums } from '@/types';
import { ShoppingCart } from 'lucide-react';
import moment from 'moment';
import { getTranslations } from 'next-intl/server';
import React from 'react';

const OrderStatus = {
  1: 'order_placed',
  2: 'to_be_continue',
  3: 'completed'
} as const;

async function MaterialOrderDetailsPage({
  params
}: {
  params: { id: string };
}) {
  const t = await getTranslations();
  const details = await getMaterialOrderDetails(params.id);

  const material = details?.material;
  const supplier = details?.supplier;

  return (
    <div className="">
      <Heading
        title={t('order_details')}
        icon={<ShoppingCart size={28} className="text-icons" />}
      />
      <div className="mt-4 @container">
        <Card className="mb-4 flex flex-col overflow-hidden @sm:!flex-row">
          <CardHeader className="flex flex-row items-start bg-muted/50 p-0">
            <div className="aspect-square h-44">
              <Tabs defaultValue="order-image">
                <TabsList className="h-auto gap-0 rounded-none border-b bg-transparent px-0 py-0 text-foreground">
                  <TabsTrigger
                    className="relative rounded-none px-4 py-2 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                    value="order-image"
                  >
                    {t('order_image')}
                  </TabsTrigger>
                  <TabsTrigger
                    className="relative rounded-none px-4 py-2 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                    value="supplier-image"
                  >
                    {t('supplier_image')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  className="flex items-center justify-center px-2"
                  value="order-image"
                >
                  <ImageZoom>
                    <img
                      src={material.image}
                      className="aspect-square rounded object-cover object-top"
                    />
                  </ImageZoom>
                </TabsContent>
                <TabsContent
                  className="flex items-center justify-center px-2"
                  value="supplier-image"
                >
                  <ImageZoom>
                    <img
                      src={details.supplier.image}
                      className="aspect-square rounded object-cover object-top"
                    />
                  </ImageZoom>
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 text-sm">
            <h2 className="mb-2 ml-6 mt-4 text-xl font-bold ">
              {t('general_info')}
            </h2>
            <div className="flow-root">
              <dl className="divide-y divide-border text-sm">
                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">{t('material')}</dt>
                  <dd className="sm:col-span-2">
                    {material.name} - {material.color} - {material.size}
                  </dd>
                </div>

                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">{t('amount')}</dt>
                  <dd className="sm:col-span-2">
                    {details.orderAmount + material.orderUnit}
                  </dd>
                </div>

                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">{t('status')}</dt>
                  <dd className="sm:col-span-2">
                    <Badge variant="outline" className="-my-3 gap-1.5">
                      <span
                        className="size-1.5 rounded-full bg-emerald-500"
                        aria-hidden="true"
                      ></span>
                      {t(
                        OrderStatus[details.status as keyof typeof OrderStatus]
                      )}
                    </Badge>
                  </dd>
                </div>

                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">
                    {t('estimated_arrival_date')}
                  </dt>
                  <dd className="sm:col-span-2">
                    {moment(details.estimatedArrivalDate).format('LL')}
                  </dd>
                </div>

                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">{t('arrival_date')}</dt>
                  <dd className="sm:col-span-2">
                    {details.arrivalDate
                      ? moment(details.estimatedArrivalDate).format('LL')
                      : t('not_yet_arrived')}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">{t('unit_price')}</dt>
                  <dd className="sm:col-span-2">
                    {details.unitPrice}{' '}
                    {
                      currencyEnums[
                        details.currency as keyof typeof currencyEnums
                      ]
                    }
                  </dd>
                </div>

                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">
                    {t('order_creator')}
                  </dt>
                  <dd className="sm:col-span-2">{details.user?.fullName}</dd>
                </div>

                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">
                    {t('order_placed_date')}
                  </dt>
                  <dd className="sm:col-span-2">
                    {moment(details.orderPlacedDate).format('LLL')}
                  </dd>
                </div>
              </dl>
            </div>

            <h2 className="mb-2 ml-6 mt-4 text-xl font-bold ">
              {t('supplier')}
            </h2>

            <div className="flow-root">
              <dl className="divide-y divide-border text-sm">
                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">{t('name')}</dt>
                  <dd className="sm:col-span-2">{supplier.name}</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">{t('phone')}</dt>
                  <dd className="sm:col-span-2">{supplier.phone}</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">
                    {t('authorized_person')}
                  </dt>
                  <dd className="sm:col-span-2">
                    {supplier.authorizedPersonFullName}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-muted-foreground">
                    {t('manufacturer_code')}
                  </dt>
                  <dd className="sm:col-span-2">
                    <Code>{supplier.manufacturerCode}</Code>
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
      <StockTable
        type="material"
        orderUnit={material.orderUnit}
        details={details}
      />
    </div>
  );
}

export default MaterialOrderDetailsPage;
