import api from '@/api';
import DescriptionList from '@/components/description-list';
import FabricCarousel from '@/components/fabric-supplier/fabric-carousel';
import MaterialCarousel from '@/components/material-supplier/material-carousel';
import WarehouseTable from '@/components/suppliers/warehouse-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupplierType } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import classNames from 'classnames';

async function getSupplierDetails(id: string) {
  try {
    const res = await api.get(`/Suppliers/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

async function SupplierDetailsPage({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  const supplier = await getSupplierDetails(params.id);

  const defaultTab =
    supplier?.type === 1 || supplier?.type === 2 ? 'fabric' : 'material';

  const listItems = [
    {
      title: t('name'),
      description: supplier.name
    },
    {
      title: t('address'),
      description: supplier.address
    },
    {
      title: t('phone'),
      description: supplier.phone
    },
    {
      title: t('authorized_person'),
      description: supplier.authorizedPersonFullName
    },
    {
      title: t('billing_address'),
      description: supplier.billingAddress
    }
  ];

  return (
    <>
      <Card className="mb-4 flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-start border-b bg-muted px-6 py-2">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {t('details')}
            </CardTitle>
            <Badge
              className={classNames(
                {
                  'bg-teal-600': supplier.type === 1,
                  'bg-blue-600': supplier.type === 2,
                  'bg-violet-600': supplier.type === 3
                },
                'ml-auto rounded-md py-0.5 text-xs'
              )}
            >
              {t(SupplierType[supplier.type as keyof typeof SupplierType])}{' '}
              {t('supplier')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 text-sm">
          <DescriptionList listItems={listItems} />
        </CardContent>
      </Card>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-2">
          {(supplier?.type === 1 || supplier?.type === 2) && (
            <TabsTrigger className="w-44" value="fabric">
              {t('fabric')}
            </TabsTrigger>
          )}
          {(supplier?.type === 1 || supplier?.type === 3) && (
            <TabsTrigger className="w-44" value="material">
              {t('material')}
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="fabric">
          <FabricCarousel data={supplier.fabrics} />
        </TabsContent>
        <TabsContent value="material">
          <MaterialCarousel data={supplier.materials} />
        </TabsContent>
      </Tabs>
      {/* <MaterialCarousel data={supplier.materials} /> */}
      <WarehouseTable data={supplier.warehouses} />
    </>
  );
}

export default SupplierDetailsPage;
