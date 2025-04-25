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

export interface FabricColorDetails {
  id: string;
  fabricName: string;
  fabricGrammage: number;
  fabricUnitName: string;
  fabricTypeName: string;
  fabricColorName: string;
  fabricColorImage: string;
  fabricColorReservedAmount: number;
  collectionColors: ColorCollection[];
  stocks: Stock[];
  suppliers: Supplier[];
  ingredients: Ingredient[];
  activeOrders: ActiveOrder[];
}

export interface ColorCollection {
  collectionId: string;
  collectionColorId: string;
  collectionName: string;
  collectionCustomerCode: string;
  collectionManufacturerCode: string;
  collectionImage: string;
  collectionColorName: string;
  percent: number;
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
  billingAddress: string;
  address: string;
  phone: string;
  authorizedPersonFullName: string;
  type: ISupplierType;
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
  amount: number;
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
  customer: BasicEntity;
  department: BasicEntity;
  category: BasicEntity;
  season: BasicEntity;
  buyer: string;
  sizeType: BasicEntity;
  garment1?: string;
  garment2?: string;
  designer?: string;
  status: keyof typeof CollectionStatus;
  productStations: ProductStation[];
  collectionNotes: CollectionNote[];
  collectionGalleries: CollectionGallery[];
  project: BasicEntity;
  subProject: BasicEntity;
  reciever: BasicEntity;
  buyerGroup: BasicEntity;
  selectionId: string;
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
  identityDefined: boolean;
  manufacturerCode: string;
  status: keyof typeof CollectionStatus;
  productStations: ProductStation[];
  materials: any[];
  fabrics: any[];
}

export interface CollectionOrderDetails {
  id: string;
  collection: {
    name: string;
    color: string;
    customerCode: string;
    manufacturerCode: string;
    image: string;
    customer: string;
  };
  order: {
    amount: number;
    plmId: string;
    groupPlmId: string;
    status: keyof typeof OrderStatus;
    deadline: string;
    approvedCostId: string;
    realCostId: string;
    sizeBarcode: {
      status: number;
      inProgressDate: string;
      preparedDate: string;
      deliveredDate: string;
    };
  };
}

export const CostEnums = {
  1: 'product_station',
  2: 'fabric',
  3: 'material'
} as const;

export interface CollectionProductStation {
  productStationId: string;
  priority: number;
}

export const collectionSampleType = {
  1: 'Selection Fit',
  2: 'Revision Fit',
  3: 'Production Fit',
  4: 'Mockup Fit',
  5: 'Shooting',
  6: 'Field Check'
};

export const collectionSampleStatus = {
  1: 'Created',
  2: 'Produced',
  3: 'Sent',
  4: 'Approved',
  5: 'Rejected'
};

export interface User {
  id: string;
  fullName: string;
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  address: string;
  indivicualPhone: string;
  companyPhone: string | null;
  familyMemberName: string;
  familyMemberPhone: string;
  role: number;
  createdDate: string;
}

export interface CostItem extends BasicEntity {
  type: number;
  details: CostDetailItem[];
}

export interface CostDetailItem {
  name: string;
  unit: number;
  price: number | undefined;
  type: number;
  currency: number;
}

export const CostType = {
  1: 'draft_unit_quantity',
  2: 'offered_unit_quantity',
  3: 'approved_unit_quantity',
  4: 'real_unit_quantity'
} as const;

export const OrderStatus = {
  1: 'new',
  2: 'planning',
  3: 'planned',
  4: 'in_product_stations',
  5: 'final_qc',
  6: 'sent',
  7: 'completed'
} as const;

export interface MaterialOrder {
  id: string;
  supplier: {
    name: string;
    phone: string;
    authorizedPersonFullName: string;
    manufacturerCode: string;
    image: string;
  };
  material: {
    name: string;
    color: string;
    size: string;
    type: string;
    orderUnit: string;
    image: string;
  };
  user?: {
    fullName: string;
    role: number;
  };
  createdUser?: {
    fullName: string;
    role: number;
  };
  orderAmount: number;
  status: number;
  estimatedArrivalDate: string;
  orderPlacedDate: string;
  arrivalDate: string | null;
  unitPrice: number;
  currency: number;
  incomingAmount: number;
  createdDate: string;
  stocks?: OrderStock[];
}

export interface FabricOrder {
  id: string;
  supplier: {
    name: string;
    phone: string;
    authorizedPersonFullName: string;
    manufacturerCode: string;
    image: string;
  };
  fabric: {
    name: string;
    grammage: string;
    color: string;
    unit: string;
    image: string;
  };
  user?: {
    fullName: string;
    role: number;
  };
  createdUser?: {
    fullName: string;
    role: number;
  };
  orderAmount: number;
  incomingAmount: number;
  status: number;
  estimatedArrivalDate: string;
  orderPlacedDate: string;
  arrivalDate: string | null;
  unitPrice: number;
  currency: number;
  createdDate: string;
  stocks?: OrderStock[];
}

export interface OrderStock {
  id: string;
  barcode: string;
  acceptedUser: string | null;
  incomingAmount: number;
  remainingAmount: number;
  returnStatus: boolean;
}

export interface CollectionColorOrder {
  id: string;
  amount: number;
  plmId: string;
  groupPlmId?: string;
  status: keyof typeof OrderStatus;
  deadline: string;
  collection?: {
    name: string;
    color: string;
    customerCode: string;
    manufacturerCode: string;
    image: string;
    customer: string;
  };
}

export interface IDState {
  id: string;
  open: boolean;
}

export interface DataState<T> {
  open: boolean;
  data: T | null;
}

export interface OrderStock {
  id: string;
  barcode: string;
  incomingAmount: number;
  remainingAmount: number;
  returnStatus: boolean;
  acceptedUser: string | null;
  collectionOrders: CollectionOrder[];
}

export interface CollectionOrder {
  id: string;
  amount: number;
  plmId: string;
  groupPlmId: string | null;
  image: string;
  name: string;
  color: string;
  customerCode: string;
  manufacturerCode: string;
  status: keyof typeof OrderStatus;
}

export interface Color extends BasicEntity {
  createdDate: string;
}
