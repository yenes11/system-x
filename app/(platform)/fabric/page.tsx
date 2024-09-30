import api from '@/api';
import { Breadcrumbs } from '@/components/breadcrumbs';
import AddFabricSheet from '@/components/fabric/add-fabric-sheet';
import PageContainer from '@/components/layout/page-container';
import FabricTable from '@/components/tables/fabric-tables/fabric-table';
import { Heading } from '@/components/ui/heading';
import { getFabricUrl } from '@/constants/api-constants';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

const breadcrumbItems = [{ title: 'fabric', link: '/fabric' }];

const getFabrics = async () => {
  try {
    const res = await api.get(getFabricUrl({ pageIndex: 0, pageSize: 9999 }));
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};

export default async function FabricLibraryPage() {
  // const fabrics = await getFabrics();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['fabrics'],
    queryFn: getFabrics
  });

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        {/* <UserClient data={users} /> */}
        <div className="flex justify-between">
          <Heading
            title="Fabrics"
            description="Manage users (Client side table functionalities.)"
          />
          <AddFabricSheet />
        </div>
      </div>
    </PageContainer>
  );
}
