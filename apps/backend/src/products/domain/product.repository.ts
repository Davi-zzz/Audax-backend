import { Product } from './product.entity';
import { Sku } from './sku.vo';

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: Sku): Promise<Product | null>;
  findAll(page: number, pageSize: number): Promise<{ items: Product[]; total: number }>;
  delete(id: string): Promise<void>;
}
