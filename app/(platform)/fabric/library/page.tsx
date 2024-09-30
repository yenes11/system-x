import api from '@/api';
import AddFabricSheet from '@/components/fabric/add-fabric-sheet';
import FabricTable from '@/components/tables/fabric-tables/fabric-table';
import { Heading } from '@/components/ui/heading';
import Icon from '@/components/ui/icon';
import { getFabricUrl } from '@/constants/api-constants';
import { ApiError, Fabric, PaginatedData } from '@/lib/types';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Scissors } from 'lucide-react';

const getFabrics = async ({
  pageIndex,
  pageSize
}: {
  pageIndex: number;
  pageSize: number;
}): Promise<PaginatedData<Fabric> | ApiError> => {
  try {
    const res = await api.get(getFabricUrl({ pageIndex, pageSize }));
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

export default async function FabricLibraryPage({
  searchParams
}: {
  searchParams: { size: string; index: string };
}) {
  const size = Number(searchParams?.size) || 10;
  const index = Number(searchParams?.index) || 0;
  const fabrics = await getFabrics({ pageIndex: index, pageSize: size });

  if ('message' in fabrics) {
    return <div>{fabrics.message}</div>;
  }

  return (
    <div className="space-y-2">
      <div className="mb-4 flex justify-between">
        <Heading
          icon={
            <Icon
              currentColor
              icon="some-files"
              size={24}
              className="text-icon"
            />
          }
          title="Fabric Library"
          description=""
        />
        <AddFabricSheet />
      </div>
      <FabricTable data={fabrics} />
    </div>
  );
}
