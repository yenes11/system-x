import AddSupplierSheet from '@/components/suppliers/add-supplier-sheet';
import SuppliersTable from '@/components/suppliers/suppliers-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { getFabricSuppliers } from '@/lib/api-calls';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';

async function FabricSupplierManagementPage() {
  const queryClient = new QueryClient();
  const t = await getTranslations();
  const fabricSuppliers = await getFabricSuppliers({
    pageIndex: 0,
    pageSize: 10
  });

  // await queryClient.prefetchQuery({
  //   queryKey: ['fabric-suppliers'],
  //   queryFn: () => getFabricSuppliers({ pageIndex: 0, pageSize: 10 })
  // });
  return (
    <div>
      <div className="space-y-2">
        <div className="mb-4 flex justify-between">
          <Heading
            title={t('supplier_management')}
            icon={<Icon icon="delivery-3" size={24} currentColor />}
          />
          <AddSupplierSheet />
        </div>
        {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
        <SuppliersTable data={fabricSuppliers} />
        {/* </HydrationBoundary> */}
      </div>
    </div>
  );
}

export default FabricSupplierManagementPage;
