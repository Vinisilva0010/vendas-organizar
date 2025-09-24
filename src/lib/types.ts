
export interface Supplier {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone:string;
  products: string;
  notes: string;
}

export interface QuoteProposal {
  id: string;
  supplierName: string;
  pricePerUnit: number;
  shippingCost: number;
  minPurchaseQuantity: number;
  deliveryTimeInDays: number;
  isBestOption?: boolean;
}

export interface Quote {
  id: string;
  title: string;
  proposals: QuoteProposal[];
}
