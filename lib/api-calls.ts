import api from '@/api';
import { getFabricSuppliersUrl, getFabricUrl } from '@/constants/api-constants';

interface Params {
  pageIndex: number;
  pageSize: number;
}

export async function getFabrics() {
  const res = await api.get(getFabricUrl({ pageIndex: 0, pageSize: 10 }));
  return res.data;
}

export const getFabricSuppliers = async (params: Params) => {
  try {
    const res = await api.get(getFabricSuppliersUrl(params));
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};

export const getCustomerDetails = async (id: string) => {
  try {
    const res = await api.get(`/Customers/${id}`);
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};
