export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  stock: number;
  image: string; // Base64 data URL or preset URL
  createdAt: string;
}

export interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  stock: string; // Keep as string in form state for easy editing, parse to number for submission
  image: string;
}

export interface ValidationErrors {
  sku?: string;
  name?: string;
  description?: string;
  stock?: string;
}

export interface ValidationSuccess {
  sku?: boolean;
  name?: boolean;
  description?: boolean;
  stock?: boolean;
}

export type ActiveTab = 'products' | 'docs';
