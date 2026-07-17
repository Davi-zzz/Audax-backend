import { Product } from '../../domain/product.entity';
import { ProductRepository } from '../../domain/product.repository';
import { Sku } from '../../domain/sku.vo';

export class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    for (const product of this.products.values()) {
      if (product.sku.equals(sku)) return product;
    }
    return null;
  }

  async findAll(page: number, pageSize: number): Promise<{ items: Product[]; total: number }> {
    const all = Array.from(this.products.values());
    const start = (page - 1) * pageSize;
    return { items: all.slice(start, start + pageSize), total: all.length };
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }
}
