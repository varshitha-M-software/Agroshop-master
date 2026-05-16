
export enum Category {
  SEEDS = 'Seeds',
  FERTILIZER = 'Fertilizer',
  TOOLS = 'Tools',
  PESTICIDES = 'Pesticides',
  EQUIPMENT = 'Equipment',
  OTHER = 'Other'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  unit: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  visitDate: string;
  purpose: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  visitorId: string;
  visitorName: string;
  items: SaleItem[];
  totalAmount: number;
  timestamp: string;
}

export type View = 'dashboard' | 'inventory' | 'visitors' | 'sales' | 'pos';
