import CollectionsCarousel from '@/components/collections-caraousel';
import CustomerDetailsCard from '@/components/customer/customer-details-card';
import DepartmentEmployeesTable from '@/components/customer/department-employees-table';
import DepartmentTree from '@/components/customer/department-tree';
import SeasonsTable from '@/components/customer/seasons-table';
import WarehouseTable from '@/components/suppliers/warehouse-table';
import { getCustomerDetails } from '@/lib/api-calls';
import { getTranslations } from 'next-intl/server';

async function CustomerPage({ params }: any) {
  const details = await getCustomerDetails(params.id);
  const t = await getTranslations();

  return (
    <div>
      <CustomerDetailsCard data={details} />
      <CollectionsCarousel data={details?.collections || []} />
      <div className="mb-4 flex gap-4 md:flex-col lg:flex-row">
        <SeasonsTable data={details?.seasons || []} />
        <WarehouseTable data={details?.warehouses || []} />
      </div>
      <div className="mb-4 flex gap-4 md:flex-col lg:flex-row">
        <DepartmentTree data={details?.departments || []} />
        <DepartmentEmployeesTable />
      </div>
    </div>
  );
}

export default CustomerPage;
