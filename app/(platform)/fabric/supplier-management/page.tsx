import AddSupplierSheet from '@/components/suppliers/add-supplier-sheet';
import SuppliersTable from '@/components/suppliers/suppliers-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { getFabricSuppliers } from '@/lib/api-calls';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

async function FabricSupplierManagementPage({
  searchParams
}: {
  searchParams: { size: string; index: string };
}) {
  const size = Number(searchParams?.size) || 5;
  const index = Number(searchParams?.index) || 0;
  const t = await getTranslations();
  const fabricSuppliers = await getFabricSuppliers({
    pageIndex: index,
    pageSize: size
  });

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
        <SuppliersTable data={fabricSuppliers} />
      </div>
    </div>
  );
}

export default FabricSupplierManagementPage;
