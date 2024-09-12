import api from '@/api';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import WarehouseTable from '@/components/suppliers/warehouse-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { Heading } from '@/components/ui/heading';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import FabricCarousel from '@/components/fabric-supplier/fabric-carousel';
import AssignFabricSheet from '@/components/fabric-supplier/assign-fabric-sheet';

async function SupplierDetailsPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const t = await getTranslations();

  const supplier = await queryClient.fetchQuery({
    queryKey: ['supplier', params.id],
    queryFn: async () => {
      const res = await api.get(`/FabricSuppliers/${params.id}`);
      return res.data;
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Card className="mb-4 flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50 px-6 py-2">
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
      <AssignFabricSheet fabricSupplierId={params.id} />
      <FabricCarousel data={supplier.fabrics} />
      <WarehouseTable data={supplier.warehouses} />
    </HydrationBoundary>
  );
}

export default SupplierDetailsPage;
