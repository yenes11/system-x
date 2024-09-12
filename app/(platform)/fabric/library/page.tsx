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
import { LibraryBig, Scissors } from 'lucide-react';
import { Suspense } from 'react';

const getFabrics = async () => {
  try {
    const res = await api.get(getFabricUrl({ pageIndex: 0, pageSize: 20 }));
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
    <div className="space-y-2">
      <div className="mb-4 flex justify-between">
        <Heading
          icon={<Scissors size={24} className="text-icon" />}
          title="Fabric Library"
          description=""
        />
        <AddFabricSheet />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FabricTable />
      </HydrationBoundary>
    </div>
  );
}
