export interface Ingredient {
  name: string;
  percentage: number;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  supportFullName: string;
  supportPhone: string;
}

export interface Department {
  id: string;
  name: string;
  parentCustomerDepartmentId: string | null;
  employees: Employee[];
  childs: Department[];
}

export interface Employee {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  customerEmployeeTypeId?: string;
  type?: string;
  customerDepartmentId: string;
}

export interface EmployeeType {
  id: string;
  name: string;
}

export const CollectionStatus = {
  1: 'unknown',
  2: 'accepted',
  3: 'rejected'
};

export const CollectionStatusColor = {
  1: 'bg-muted text-muted-foreground',
  2: 'bg-green-500/40',
  3: 'bg-red-500'
};

export type ICollectionStatus = keyof typeof CollectionStatus;

export interface ICollection {
  id: string;
  name: string;
  image: string;
  customerCode: string;
  manufacturerCode: string;
  status: ICollectionStatus;
}

export interface MaterialCollection {
  collectionName: string;
  collectionCustomerCode: string;
  collectionManufacturerCode: string;
  collectionImage: string;
  collectionColorName: string;
  amount: number;
}

export interface IColor {
  id: string;
  name: string;
  image: string;
}

export const MaterialUnit = {
  1: 'Piece',
  2: 'Meter',
  3: 'Centimeter'
};

export type IMaterialUnit = keyof typeof MaterialUnit;

export interface IMaterial {
  id: string;
  name: string;
  unit: IMaterialUnit;
  colors: IColor[];
}

export type PaginatedData<T> = {
  items: T[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

interface CollectionColor {
  collectionName: string;
  collectionCustomerCode: string;
  collectionManufacturerCode: string;
  collectionImage: string;
  collectionColorName: string;
  amount: number;
}

interface Stock {
  materialColorStockId: string;
  barcode: string;
  remainingAmount: number;
}

interface ActiveOrder {
  materialColorOrderId: string;
  futureOrdersStock: number;
  status: number;
  estimatedArrivalDate: string;
  unitPrice: number;
  currency: number;
}

interface Supplier {
  materialSupplierId: string;
  materialSupplierMaterialColorId: string;
  manufacturerCode: string;
  name: string;
  phone: string;
  authorizedPersonFullName: string;
}

export interface MaterialColor {
  id: string;
  name: string;
  image: string;
  materialId: string;
  materialName: string;
  unit: IMaterialUnit;
  reservedAmount: number;
  collectionColors: CollectionColor[];
  stocks: Stock[];
  activeOrders: ActiveOrder[];
  suppliers: Supplier[];
}
