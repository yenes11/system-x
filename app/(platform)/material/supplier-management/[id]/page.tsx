import api from '@/api';
import AssignFabricSheet from '@/components/fabric-supplier/assign-fabric-sheet';
import FabricCarousel from '@/components/fabric-supplier/fabric-carousel';
import WarehouseTable from '@/components/suppliers/warehouse-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';

async function getMaterialSupplierDetails(id: string) {
  try {
    const res = await api.get(`/MaterialSuppliers/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

async function MaterialSupplierDetailsPage({
  params
}: {
  params: { id: string };
}) {
  const t = await getTranslations();
  const supplier = await getMaterialSupplierDetails(params.id);

  return (
    <>
      <Card className="mb-4 flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted px-6 py-2">
          <div className="flex h-full flex-col">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {t('details')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 text-sm">
          <div className="grid gap-3">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('name')}</span>
                <span>{supplier.name}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('address')}</span>
                <span>{supplier.address}</span>
              </li>
            </ul>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('phone')}</span>
                <span>{supplier.phone}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('authorized_person')}
                </span>
                <span>{supplier.authorizedPersonFullName}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('billing_address')}
                </span>
                <span>{supplier.billingAddress}</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* <FabricCarousel data={supplier.material} /> */}
      <WarehouseTable data={supplier.warehouses} />
    </>
  );
}

export default MaterialSupplierDetailsPage;
