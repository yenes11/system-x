import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import AddSupplierSheet from '@/components/suppliers/add-supplier-sheet';
import SuppliersTable from '@/components/suppliers/suppliers-table';
import { Heading } from '@/components/ui/heading';
import { getFabricSuppliersUrl } from '@/constants/api-constants';
import { getFabricSuppliers } from '@/lib/api-calls';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { Package2 } from 'lucide-react';
import React from 'react';

const breadcrumbItems = [
  { title: 'fabric', link: '/fabric/library' },
  { title: 'supplier_management', link: '/fabric/supplier-management' }
];

async function FabricSupplierManagementPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['fabric-suppliers'],
    queryFn: () => getFabricSuppliers({ pageIndex: 0, pageSize: 10 })
  });
  return (
    <div>
      <div className="space-y-2">
        <div className="mb-4 flex justify-between">
          <Heading
            title="Supplier Management"
            icon={<Package2 size={28} className="text-icon" />}
          />
          <AddSupplierSheet />
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SuppliersTable />
        </HydrationBoundary>
      </div>
    </div>
  );
}

export default FabricSupplierManagementPage;
