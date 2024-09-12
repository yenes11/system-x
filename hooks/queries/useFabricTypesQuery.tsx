'use client';

import api from '@/api';
import { useQuery } from '@tanstack/react-query';

interface FabricType {
  id: string;
  name: string;
}

async function getFabricTypes(): Promise<FabricType[]> {
  const response = await api.get('/FabricTypes');
  return response.data;
}

function useFabricTypesQuery() {
  return useQuery({
    queryKey: ['fabric-types'],
    queryFn: getFabricTypes
  });
}

export default useFabricTypesQuery;
