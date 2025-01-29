import AddSupplierSheet from '@/components/suppliers/add-supplier-sheet';
import SuppliersTable from '@/components/suppliers/suppliers-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { getSuppliers } from '@/lib/api-calls';
import { Package2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Mate } from 'next/font/google';

async function SupplierPage({
  searchParams
}: {
  searchParams: { size: string; index: string; name: string };
}) {
  const t = await getTranslations();
  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const name = searchParams?.name || '';
  const materialSuppliers = await getSuppliers({
    pageIndex: index,
    pageSize: size,
    name
  });

  return (
    <div>
      <div className="space-y-2">
        <div className="mb-4 flex justify-between">
          <Heading title={t('suppliers')} icon={<Package2 size={24} />} />
          <AddSupplierSheet />
        </div>
        <SuppliersTable data={materialSuppliers} />
      </div>
    </div>
  );
}

export default SupplierPage;
