import { CreateProductUseCase } from './create-product.usecase';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product.repository';
import { DuplicateSkuError } from '../domain/product.errors';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let repository: InMemoryProductRepository;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    useCase = new CreateProductUseCase(repository);
  });

  it('should create product', async () => {
    const result = await useCase.execute({
      id: '1',
      sku: 'SKU123',
      name: 'Laptop',
      price: 99900,
      stock: 10,
    });
    expect(result.id).toBe('1');
  });

  it('should reject duplicate SKU', async () => {
    await useCase.execute({ id: '1', sku: 'SKU123', name: 'Laptop', price: 99900, stock: 10 });
    await expect(
      useCase.execute({ id: '2', sku: 'SKU123', name: 'Desktop', price: 79900, stock: 5 })
    ).rejects.toThrow(DuplicateSkuError);
  });
});
