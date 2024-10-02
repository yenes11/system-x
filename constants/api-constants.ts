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
const URL_MATERIAL = '/Materials';
export const URL_MATERIAL_COLOR = '/MaterialColors';
export const URL_USER_INFO = '/Users/GetFromAuth';
export const URL_COLLECTIONS = '/Collections';

export const getFabricUrl = (params: QueryParams) =>
  `${URL_FABRIC}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

export const getMaterialUrl = (params: QueryParams) =>
  `${URL_MATERIAL}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

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

export const getMaterialSuppliersUrl = (params: QueryParams) =>
  `${URL_MATERIAL_SUPPLIERS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

export const URL_USER = `/Users/GetFromAuth`;
