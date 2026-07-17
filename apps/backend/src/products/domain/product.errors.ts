export class DuplicateSkuError extends Error {
  constructor(sku: string) {
    super(`A product with SKU "${sku}" already exists`);
    this.name = 'DuplicateSkuError';
  }
}

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product with ID "${id}" not found`);
    this.name = 'ProductNotFoundError';
  }
}
