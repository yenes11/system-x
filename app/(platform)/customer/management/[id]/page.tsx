import CollectionsCarousel from '@/components/collections-caraousel';
import CustomerDetailsCard from '@/components/customer/customer-details-card';
import DepartmentEmployeesTable from '@/components/customer/department-employees-table';
import DepartmentTree from '@/components/customer/department-tree';
import SeasonsTable from '@/components/customer/seasons-table';
import WarehouseTable from '@/components/suppliers/warehouse-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCustomerDetails } from '@/lib/api-calls';
import { getTranslations } from 'next-intl/server';

async function CustomerPage({ params }: any) {
  const details = await getCustomerDetails(params.id);
  const t = await getTranslations();

  return (
    <div>
      <CustomerDetailsCard data={details} />
      <CollectionsCarousel data={details?.collections || []} />

      <Tabs defaultValue="seasons" className="mb-2">
        <TabsList>
          <TabsTrigger value="seasons">{t('seasons')}</TabsTrigger>
          <TabsTrigger value="warehouses">{t('warehouses')}</TabsTrigger>
          <TabsTrigger value="departments">{t('departments')}</TabsTrigger>
        </TabsList>
        <TabsContent value="seasons" className="">
          <SeasonsTable data={details?.seasons || []} />
        </TabsContent>
        <TabsContent value="warehouses" className="">
          <WarehouseTable data={details?.warehouses || []} />
        </TabsContent>
        <TabsContent
          value="departments"
          className="mb-4 flex gap-4 md:flex-col lg:flex-row"
        >
          <DepartmentTree data={details?.departments || []} />
          <DepartmentEmployeesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CustomerPage;
