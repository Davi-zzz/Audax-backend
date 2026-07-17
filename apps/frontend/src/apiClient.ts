import { Product, ProductFormData } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function imageToBase64(imageSrc: string): Promise<string | null> {
  if (!imageSrc) return null;
  if (imageSrc.startsWith('data:')) return imageSrc.split(',')[1];
  try {
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string | null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export const api = {
  async createProduct(data: ProductFormData): Promise<Product> {
    const imageBase64 = await imageToBase64(data.image);
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `prod-${Date.now()}`,
        sku: data.sku.toUpperCase().trim(),
        name: data.name.trim(),
        description: data.description.trim(),
        price: parseInt(data.price),
        stock: parseInt(data.stock),
        image: imageBase64,
      }),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const product = await res.json();
    return {
      ...product,
      image: product.image ? `data:application/octet-stream;base64,${product.image}` : null,
    };
  },

  async listProducts(page = 1, pageSize = 10): Promise<{ items: Product[]; total: number }> {
    const res = await fetch(`${API_URL}/products?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return {
      ...data,
      items: data.items.map((p: Product) => ({
        ...p,
        image: p.image ? `data:application/octet-stream;base64,${p.image}` : null,
      })),
    };
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();
    return {
      ...product,
      image: product.image ? `data:application/octet-stream;base64,${product.image}` : null,
    };
  },

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    const imageBase64 = await imageToBase64(data.image);
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name.trim(),
        description: data.description.trim(),
        price: parseInt(data.price),
        stock: parseInt(data.stock),
        image: imageBase64,
      }),
    });
    if (!res.ok) throw new Error('Failed to update product');
    const product = await res.json();
    return {
      ...product,
      image: product.image ? `data:application/octet-stream;base64,${product.image}` : null,
    };
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },
};
