import { DeleteProductUseCase } from './delete-product.usecase';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product.repository';
import { CreateProductUseCase } from './create-product.usecase';
import { GetProductUseCase } from './get-product.usecase';
import { ProductNotFoundError } from '../domain/product.errors';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let createUseCase: CreateProductUseCase;
  let getUseCase: GetProductUseCase;
  let repo: InMemoryProductRepository;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    useCase = new DeleteProductUseCase(repo);
    createUseCase = new CreateProductUseCase(repo);
    getUseCase = new GetProductUseCase(repo);
  });

  it('should delete product', async () => {
    await createUseCase.execute({ id: '1', sku: 'SKU1', name: 'Laptop', price: 99900, stock: 10 });
    await useCase.execute('1');
    await expect(getUseCase.execute('1')).rejects.toThrow(ProductNotFoundError);
  });

  it('should throw if not found', async () => {
    await expect(useCase.execute('nonexistent')).rejects.toThrow(ProductNotFoundError);
  });
});
