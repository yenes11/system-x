interface QueryParams {
  pageIndex: number;
  pageSize: number;
}

const URL_BASE = process.env.BASE_URL;
export const URL_LOGIN = '/Auth/Login';

const URL_FABRIC = '/Fabrics';
const URL_FABRIC_SUPPLIERS = '/FabricSuppliers';
const URL_MATERIAL = '/Materials';
export const URL_MATERIAL_COLOR = '/MaterialColors';

export const getFabricUrl = (params: QueryParams) =>
  `${URL_FABRIC}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

export const getMaterialUrl = (params: QueryParams) =>
  `${URL_MATERIAL}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

export const getFabricSuppliersUrl = (params: QueryParams) =>
  `${URL_FABRIC_SUPPLIERS}?PageIndex=${params.pageIndex}&PageSize=${params.pageSize}`;

export const URL_USER = `/Users/GetFromAuth`;
