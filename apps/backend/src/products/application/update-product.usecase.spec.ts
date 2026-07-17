import { UpdateProductUseCase } from './update-product.usecase';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product.repository';
import { CreateProductUseCase } from './create-product.usecase';
import { ProductNotFoundError } from '../domain/product.errors';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let createUseCase: CreateProductUseCase;
  let repo: InMemoryProductRepository;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    useCase = new UpdateProductUseCase(repo);
    createUseCase = new CreateProductUseCase(repo);
  });

  it('should update product', async () => {
    await createUseCase.execute({ id: '1', sku: 'SKU1', name: 'Laptop', price: 99900, stock: 10 });
    const result = await useCase.execute({ id: '1', name: 'Desktop', price: 79900, stock: 5 });
    expect(result.name).toBe('Desktop');
    expect(result.sku.value).toBe('SKU1');
  });

  it('should throw if not found', async () => {
    await expect(useCase.execute({ id: 'x', name: 'X', price: 1, stock: 1 })).rejects.toThrow(ProductNotFoundError);
  });
});
