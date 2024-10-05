import api from '@/api';
import {
  getCollectionsUrl,
  getFabricSuppliersUrl,
  getFabricUrl,
  getMaterialSuppliersUrl
} from '@/constants/api-constants';
import { ICollectionStatus, PaginatedData, Supplier } from './types';

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

export const getCollections = async (
  params: Params & {
    customerId?: string;
    categoryId?: string;
    customerCode?: string;
    status?: ICollectionStatus;
  }
) => {
  try {
    const res = await api.get(getCollectionsUrl(params));
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};

export const getCategories = async () => {
  try {
    const res = await api.get('/Categories');
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};

export const getCustomers = async ({
  pageIndex,
  pageSize
}: {
  pageIndex: number;
  pageSize: number;
}) => {
  try {
    const res = await api.get(
      `/Customers?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getMaterialSuppliers = async (
  params: Params
): Promise<PaginatedData<Supplier>> => {
  try {
    const res = await api.get(getMaterialSuppliersUrl(params));
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
    throw e;
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
