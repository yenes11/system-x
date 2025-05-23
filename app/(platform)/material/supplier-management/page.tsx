import AddSupplierSheet from '@/components/suppliers/add-supplier-sheet';
import SuppliersTable from '@/components/suppliers/suppliers-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { getSuppliers } from '@/lib/api-calls';
import { getTranslations } from 'next-intl/server';
import { Mate } from 'next/font/google';

async function MaterialSupplierManagement({
  searchParams
}: {
  searchParams: { size: string; index: string };
}) {
  const t = await getTranslations();
  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const materialSuppliers = await getSuppliers({
    pageIndex: index,
    pageSize: size,
    name: ''
  });

  return (
    <div>
      <div className="space-y-2">
        <div className="mb-4 flex justify-between">
          <Heading
            title={t('material_management')}
            icon={<Icon icon="delivery-3" size={24} currentColor />}
          />
          <AddSupplierSheet />
        </div>
        <SuppliersTable data={materialSuppliers} />
      </div>
    </div>
  );
}

export default MaterialSupplierManagement;
