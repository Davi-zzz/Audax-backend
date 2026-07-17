import { ListProductsUseCase } from './list-products.usecase';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product.repository';
import { CreateProductUseCase } from './create-product.usecase';

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
  let createUseCase: CreateProductUseCase;
  let repo: InMemoryProductRepository;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    useCase = new ListProductsUseCase(repo);
    createUseCase = new CreateProductUseCase(repo);
  });

  it('should list products with pagination', async () => {
    await createUseCase.execute({ id: '1', sku: 'SKU1', name: 'P1', price: 100, stock: 10 });
    await createUseCase.execute({ id: '2', sku: 'SKU2', name: 'P2', price: 200, stock: 20 });

    const result = await useCase.execute({ page: 1, pageSize: 10 });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
  });
});
