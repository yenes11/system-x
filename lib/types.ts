export interface Ingredient {
  name: string;
  percentage: number;
}

export interface Fabric extends BasicEntity {
  grammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
}

export interface BasicEntity {
  id: string;
  name: string;
}

export const SupplierType = {
  1: 'FabricMaterialSupplier',
  2: 'FabricSupplier',
  3: 'MaterialSupplier'
};

export type ISupplierType = keyof typeof SupplierType;

export interface FabricWithColors extends BasicEntity {
  grammage: number;
  unit: string;
  type: string;
  colors: FabricColor[];
}

export interface FabricColor extends BasicEntity {
  image: string;
  ingredients: Ingredient[];
}

export interface Warehouse extends BasicEntity {
  address: string;
  longitude: string;
  latitude: string;
  supportFullName: string;
  supportPhone: string;
}

export interface Department extends BasicEntity {
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

export interface EmployeeType extends BasicEntity {}

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

export const CollectionPingColor = {
  1: 'bg-slate-500',
  2: 'bg-green-500',
  3: 'bg-destructive'
};

export type ICollectionStatus = keyof typeof CollectionStatus;

export interface Category extends BasicEntity {
  parentCategoryId: string | null;
  shortName: string;
  description: string;
  subCategories: Category[];
}

export interface SubcategoryInfo extends BasicEntity {}

export interface ICollection extends BasicEntity {
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

export interface IColor extends BasicEntity {
  image: string;
}

export const MaterialUnit = {
  1: 'Piece',
  2: 'Meter',
  3: 'Centimeter'
};

export type IMaterialUnit = keyof typeof MaterialUnit;

interface MaterialType {
  name: string;
  identityUnit: string;
  orderUnit: string;
  variantUnit: string;
}

interface MaterialAttribute {
  id: string;
  attributeId: string;
  name: string;
  value: string;
}

interface MaterialColorVariant {
  id: string;
  size: string;
  image: string;
}

export interface MaterialColor extends BasicEntity {
  image: string;
  variants: MaterialColorVariant[];
}

export interface IMaterial extends BasicEntity {
  type: MaterialType;
  attributes: MaterialAttribute[];
  colors: MaterialColor[];
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

interface MaterialSupplier {
  materialSupplierId: string;
  materialSupplierMaterialColorId: string;
  manufacturerCode: string;
  name: string;
  phone: string;
  authorizedPersonFullName: string;
}

export interface Supplier extends BasicEntity {
  address: string;
  phone: string;
  authorizedPersonFullName: string;
}

export interface MaterialVariant {
  id: string;
  image: string;
  materialId: string;
  materialName: string;
  type: MaterialType;
  size: string;
  reservedAmount: number;
  collectionColors: CollectionColor[];
  stocks: Stock[];
  activeOrders: ActiveOrder[];
  suppliers: MaterialSupplier[];
}

export interface Attribute {
  name: string;
  value: string;
}

export interface CollectionMaterial {
  id: string;
  materialColorVariantId: string;
  amount: string;
  size: string;
  image: string;
  name: string;
  color: string;
  attributes: Attribute[];
}

export type ApiError = {
  message: string;
  statusCode: number;
};

export interface ProductStation extends BasicEntity {
  priority: 1 | 2 | 3;
}

export interface CollectionNote {
  id: string;
  user: string;
  message: string;
  createdDate: string;
  updatedDate?: string;
}

export interface CollectionGallery {
  id: string;
  image: string;
  createdDate: string;
}

export interface CollectionDetails extends BasicEntity {
  description: string;
  image: string;
  customerCode: string;
  manufacturerCode: string;
  customer: string;
  department: string;
  category: string;
  season: string;
  buyer: string;
  sizeType: string;
  garment1?: string;
  garment2?: string;
  designer?: string;
  status: keyof typeof CollectionStatus;
  productStations: ProductStation[];
  collectionNotes: CollectionNote[];
  collectionGalleries: CollectionGallery[];
}

export interface CollectionDraft {
  id: string;
  collectionName: string;
  description: string;
  collectionColor: string;
  customerDepartmentName: string;
  categoryName: string;
  customerSeasonName: string;
  buyer: string;
  sizeTypeName: string;
  garment1?: string;
  garment2?: string;
  designer?: string;
  image: string;
  customerCode: string;
  manufacturerCode: string;
  status: keyof typeof CollectionStatus;
  productStations: ProductStation[];
  materials: any[];
  fabrics: any[];
}

export interface CollectionProductStation {
  productStationId: string;
  priority: number;
}
