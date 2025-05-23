import api from '@/api';
import {
  getFabricsWithColorsUrl,
  getFabricSuppliersUrl,
  getFabricUrl,
  getMaterialSuppliersUrl,
  getCollectionsUrl,
  URL_MATERIAL_VARIANT,
  getSuppliersUrl,
  getCollectionOrdersUrl,
  getFabricOrdersUrl,
  getMaterialOrdersUrl
} from '@/constants/api-constants';
import {
  ApiError,
  CollectionDetails,
  CollectionDraft,
  CollectionOrderDetails,
  Fabric,
  FabricColorDetails,
  FabricOrder,
  ICollectionStatus,
  MaterialOrder,
  MaterialVariant,
  PaginatedData,
  Supplier
} from './types';
import { AxiosError } from 'axios';

interface Params {
  pageIndex: number;
  pageSize: number;
}

export const getFabricSuppliers = async (params: Params) => {
  try {
    const res = await api.get(getFabricSuppliersUrl(params));
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};

export const getCollectionDetails = async (id: string) => {
  try {
    const res = await api.get(`/Collections/${id}`);
    return res.data as CollectionDetails;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.title || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getCollectionDraftDetails = async (id: string) => {
  try {
    const res = await api.get(
      `/CollectionColors/GetCollectionColorDetail/${id}`
    );
    return res.data as CollectionDraft;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.title || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getCollectionOrderDetails = async (id: string) => {
  try {
    const res = await api.get(`/CollectionColorOrders/${id}`);
    return res.data as CollectionOrderDetails;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.title || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getFabricColorDetail = async (id: string) => {
  try {
    const res = await api.get(`/FabricColors/${id}`);
    return res.data as FabricColorDetails;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.title || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getMaterialOrderDetails = async (id: string) => {
  try {
    const res = await api.get(`/MaterialColorVariantOrders/${id}`);
    return res.data as MaterialOrder;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.title || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getFabricOrderDetails = async (id: string) => {
  try {
    const res = await api.get(`/FabricColorOrders/${id}`);
    return res.data as FabricOrder;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.title || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getFabrics = async ({
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
      throw new Error(e.response?.data?.title || 'An error occurred');
      // return {
      //   message: e.response?.data?.title || 'An error occurred',
      //   statusCode: e.response?.status as number
      // };
    } else {
      throw new Error('An unknown error occurred');
      // return {
      //   message: 'An unknown error occurred',
      //   statusCode: 500
      // };
    }
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

export const getCollectionOrders = async (
  params: Params & {
    plmId?: string;
    groupPlmId?: string;
    customerId?: string;
    status?: ICollectionStatus;
  }
) => {
  try {
    const res = await api.get(getCollectionOrdersUrl(params));
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
  }
};

export const getFabricsWithColors = async (
  params: Params & {
    name?: string;
    grammage?: string;
  }
) => {
  try {
    console.log(getFabricsWithColorsUrl(params), 'search url');
    const res = await api.get(getFabricsWithColorsUrl(params));
    console.log(res.data, 'respoonse');
    return res.data;
  } catch (e: any) {
    console.log('error');
    console.log(e?.response?.data, 'error');
  }
};

export async function getMaterialVariant(id: string): Promise<MaterialVariant> {
  try {
    const response = await api.get(`${URL_MATERIAL_VARIANT}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

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

export const getSuppliers = async (
  params: Params & { name: string }
): Promise<PaginatedData<Supplier>> => {
  try {
    const res = await api.get(getSuppliersUrl(params));
    return res.data;
  } catch (e: any) {
    console.log(e?.response?.data, 'error');
    throw e;
  }
};

export const getFabricOrders = async (
  params: Params & { status: string }
): Promise<PaginatedData<FabricOrder>> => {
  try {
    const res = await api.get(getFabricOrdersUrl(params));
    return res.data;
  } catch (e: any) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.title || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getMaterialOrders = async (
  params: Params & { status: string }
): Promise<PaginatedData<MaterialOrder>> => {
  try {
    const res = await api.get(getMaterialOrdersUrl(params));
    return res.data;
  } catch (e: any) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.title || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
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
