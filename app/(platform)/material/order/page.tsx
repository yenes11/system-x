import FabricOrdersTable from '@/components/fabric/fabric-order-sheet';
import MaterialOrdersTable from '@/components/material/material-orders-table';
import { Heading } from '@/components/ui/heading';
import { getFabricOrders, getMaterialOrders } from '@/lib/api-calls';
import { ShoppingCart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface SearchParams {
  size: string;
  index: string;
  status: string;
}

async function MaterialOrdersPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations();

  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const status = searchParams?.status;
  const orders = await getMaterialOrders({
    pageIndex: index,
    pageSize: size,
    status
  });

  return (
    <div className="space-y-2">
      <div className="mb-4 flex justify-between">
        <Heading icon={<ShoppingCart />} title={t('material_orders')} />
      </div>
      <MaterialOrdersTable data={orders} />
    </div>
  );
}

export default MaterialOrdersPage;
