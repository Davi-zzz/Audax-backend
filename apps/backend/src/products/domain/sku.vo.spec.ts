import { Sku } from './sku.vo';

describe('Sku Value Object', () => {
  it('should reject empty SKU', () => {
    expect(() => new Sku('')).toThrow('SKU is required');
  });

  it('should reject SKU with less than 3 characters', () => {
    expect(() => new Sku('AB')).toThrow('SKU must have at least 3 characters');
  });

  it('should accept valid SKU with 3+ characters', () => {
    const sku = new Sku('ABC123');
    expect(sku.value).toBe('ABC123');
  });

  it('should compare two equal SKUs as equivalent', () => {
    const sku1 = new Sku('ABC123');
    const sku2 = new Sku('ABC123');
    expect(sku1.equals(sku2)).toBe(true);
  });

  it('should compare two different SKUs as not equivalent', () => {
    const sku1 = new Sku('ABC123');
    const sku2 = new Sku('DEF456');
    expect(sku1.equals(sku2)).toBe(false);
  });
});
