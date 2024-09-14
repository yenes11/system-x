import api from '@/api';
import AddFabricSheet from '@/components/fabric/add-fabric-sheet';
import FabricTable from '@/components/tables/fabric-tables/fabric-table';
import { Heading } from '@/components/ui/heading';
import { getFabricUrl } from '@/constants/api-constants';
import { ApiError, Fabric, PaginatedData } from '@/lib/types';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Scissors } from 'lucide-react';

const getFabrics = async (): Promise<PaginatedData<Fabric> | ApiError> => {
  try {
    const res = await api.get(getFabricUrl({ pageIndex: 0, pageSize: 10 }));
    return res.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return {
        message: e.response?.data?.title || 'An error occurred',
        statusCode: e.response?.status as number
      };
    } else {
      return {
        message: 'An unknown error occurred',
        statusCode: 500
      };
    }
  }
};

export default async function FabricLibraryPage() {
  const fabrics = await getFabrics();

  if ('message' in fabrics) {
    return <div>{fabrics.message}</div>;
  }

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
      <FabricTable data={fabrics.items} />
    </div>
  );
}
