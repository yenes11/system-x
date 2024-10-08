'use client';

import api from '@/api';
import { useQuery } from '@tanstack/react-query';

interface FabricUnit {
  id: string;
  name: string;
}

async function getFabricUnits(): Promise<FabricUnit[]> {
  const response = await api.get('/FabricUnits');
  return response.data;
}

function useFabricUnitsQuery({ enabled = true } = {}) {
  return useQuery({
    queryKey: ['fabric-units'],
    queryFn: getFabricUnits,
    enabled
  });
}

export default useFabricUnitsQuery;
