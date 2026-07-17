export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  stock: number;
  image: string | null; // Base64 data URL, preset URL, or null when absent
  createdAt: string;
  price: number;
}

export interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  stock: string; // Keep as string in form state for easy editing, parse to number for submission
  image: string;
  price: string; // Same as stock: string in form state, parsed to number on submission
}

export interface ValidationErrors {
  sku?: string;
  name?: string;
  description?: string;
  stock?: string;
  price?: string;
}

export interface ValidationSuccess {
  sku?: boolean;
  name?: boolean;
  description?: boolean;
  stock?: boolean;
  price?: boolean;
}

export type ActiveTab = 'products' | 'docs';
