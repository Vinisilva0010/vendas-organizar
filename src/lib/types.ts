export interface Supplier {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  products: string;
  notes: string;
}

export interface Proposal {
  id: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  shippingCost: number;
  moq: number;
  leadTime: number;
  isBestOption?: boolean;
}

export interface Quote {
  id: string;
  name: string;
  proposals: Proposal[];
}

export type OrderStatus = 'placed' | 'shipped' | 'in-transit' | 'received';

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  displayId: string;
  supplierId: string;
  supplierName: string;
  orderDate: string; 
  expectedDeliveryDate: string;
  items: OrderItem[];
  totalValue: number;
  status: OrderStatus;
}
