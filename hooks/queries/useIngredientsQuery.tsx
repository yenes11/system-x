'use client';

import api from '@/api';
import { useQuery } from '@tanstack/react-query';

interface Ingrediend {
  id: string;
  name: string;
}

async function getIngredients(): Promise<Ingrediend[]> {
  const response = await api.get('/Ingredients');
  return response.data;
}

function useIngredientsQuery() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients
  });
}

export default useIngredientsQuery;
