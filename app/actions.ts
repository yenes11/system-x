'use server';

import api from '@/api';
import axios from 'axios';

export async function getTodos() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/todos'
  );
  console.log('first');
  return response.data;
}

export async function addFabricFn(fabric: any) {
  console.log('serverdan selam', fabric);
  return await api.post('/Fabrics', fabric);
}
