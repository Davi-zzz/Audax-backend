import { Product } from './product.entity';
import { Sku } from './sku.vo';
import { Price } from './price.vo';

describe('Product Entity', () => {
  it('should create a product with valid data', () => {
    const product = new Product('1', new Sku('SKU123'), 'Laptop', new Price(99900), 10);
    expect(product.id).toBe('1');
    expect(product.sku.value).toBe('SKU123');
  });

  it('should update product (except SKU)', () => {
    const product = new Product('1', new Sku('SKU123'), 'Laptop', new Price(99900), 10);
    product.update('Desktop', new Price(79900), 5);
    expect(product.name).toBe('Desktop');
    expect(product.sku.value).toBe('SKU123');
  });
});
