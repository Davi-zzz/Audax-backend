import { GetProductUseCase } from './get-product.usecase';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product.repository';
import { CreateProductUseCase } from './create-product.usecase';
import { ProductNotFoundError } from '../domain/product.errors';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let createUseCase: CreateProductUseCase;
  let repo: InMemoryProductRepository;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    useCase = new GetProductUseCase(repo);
    createUseCase = new CreateProductUseCase(repo);
  });

  it('should get product by id', async () => {
    await createUseCase.execute({ id: '1', sku: 'SKU1', name: 'Laptop', price: 99900, stock: 10 });
    const result = await useCase.execute('1');
    expect(result.id).toBe('1');
  });

  it('should throw if not found', async () => {
    await expect(useCase.execute('nonexistent')).rejects.toThrow(ProductNotFoundError);
  });
});
