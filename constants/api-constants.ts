import { ICollectionStatus } from '@/lib/types';

interface QueryParams {
  pageIndex: number;
  pageSize: number;
}

const URL_BASE = process.env.BASE_URL;
export const URL_LOGIN = '/Auth/Login';

const URL_FABRIC = '/Fabrics';
const URL_FABRIC_SUPPLIERS = '/FabricSuppliers';
const URL_MATERIAL_SUPPLIERS = '/MaterialSuppliers';
const URL_SUPPLIERS = '/Suppliers';
const URL_MATERIAL = '/Materials';
const URL_FABRIC_ORDERS = '/FabricColorOrders';
const URL_MATERIAL_ORDERS = '/MaterialColorVariantOrders';
export const URL_MATERIAL_VARIANT = '/MaterialColorVariants';
export const URL_MATERIAL_COLOR = '/MaterialColors';
export const URL_USER_INFO = '/Users/GetFromAuth';
export const URL_COLLECTIONS = '/Collections';
export const URL_COLLECTION_ORDERS = '/CollectionColorOrders';
export const URL_FABRICS_WITH_COLORS = `${URL_FABRIC}/GetFabricsWithColors`;

export const getFabricUrl = (params: QueryParams) =>
  `${URL_FABRIC}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

export const getMaterialUrl = (
  params: QueryParams & {
    name?: string;
    type?: string;
  }
) => {
  let url = `${URL_MATERIAL}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;
  if (params.name) {
    url += `&Name=${params.name}`;
  }
  if (params.type) {
    url += `&materialTypeId=${params.type}`;
  }

  return url;
};

export const getFabricSuppliersUrl = (params: QueryParams) =>
  `${URL_FABRIC_SUPPLIERS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

export const getCollectionsUrl = (
  params: QueryParams & {
    customerId?: string;
    categoryId?: string;
    customerCode?: string;
    status?: ICollectionStatus;
  }
) => {
  let url = `${URL_COLLECTIONS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;
  if (params.customerId) {
    url += `&CustomerId=${params.customerId}`;
  }
  if (params.categoryId) {
    url += `&CategoryId=${params.categoryId}`;
  }
  if (params.customerCode) {
    url += `&CustomerCode=${params.customerCode}`;
  }
  if (params.status) {
    url += `&Status=${params.status}`;
  }
  return url;
};

export const getCollectionOrdersUrl = (
  params: QueryParams & {
    plmId?: string;
    groupPlmId?: string;
    customerId?: string;
    status?: ICollectionStatus;
  }
) => {
  let url = `${URL_COLLECTION_ORDERS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;
  if (params.plmId) {
    url += `&PlmId=${params.plmId}`;
  }
  if (params.groupPlmId) {
    url += `&GroupPlmId=${params.groupPlmId}`;
  }
  if (params.customerId) {
    url += `&CustomerId=${params.customerId}`;
  }
  if (params.status) {
    url += `&Status=${params.status}`;
  }
  return url;
};

export const getFabricsWithColorsUrl = (
  params: QueryParams & {
    name?: string;
    grammage?: string;
  }
) => {
  let url = `${URL_FABRICS_WITH_COLORS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;
  if (params.name) {
    url += `&Name=${params.name}`;
  }
  if (params.grammage) {
    url += `&Grammage=${params.grammage}`;
  }
  return url;
};

export const getMaterialSuppliersUrl = (params: QueryParams) =>
  `${URL_MATERIAL_SUPPLIERS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

export const getSuppliersUrl = (params: QueryParams & { name: string }) => {
  let url = `${URL_SUPPLIERS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;
  if (params.name) {
    url += `&Name=${params.name}`;
  }
  return url;
};

export const getFabricOrdersUrl = (
  params: QueryParams & { status: string }
) => {
  let url = `${URL_FABRIC_ORDERS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;
  if (params.status) {
    url += `&Status=${params.status}`;
  }
  return url;
};

export const getMaterialOrdersUrl = (
  params: QueryParams & { status: string }
) => {
  let url = `${URL_MATERIAL_ORDERS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;
  if (params.status) {
    url += `&Status=${params.status}`;
  }
  return url;
};

export const URL_USER = `/Users/GetFromAuth`;
