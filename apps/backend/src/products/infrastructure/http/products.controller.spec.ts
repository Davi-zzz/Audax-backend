import { ProductsController } from './products.controller';
import { CreateProductUseCase } from '../../application/create-product.usecase';
import { ListProductsUseCase } from '../../application/list-products.usecase';
import { GetProductUseCase } from '../../application/get-product.usecase';
import { UpdateProductUseCase } from '../../application/update-product.usecase';
import { DeleteProductUseCase } from '../../application/delete-product.usecase';
import { InMemoryProductRepository } from '../persistence/in-memory-product.repository';

describe('ProductsController', () => {
  let controller: ProductsController;
  let repo: InMemoryProductRepository;
  let createUseCase: CreateProductUseCase;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    createUseCase = new CreateProductUseCase(repo);
    const listUseCase = new ListProductsUseCase(repo);
    const getUseCase = new GetProductUseCase(repo);
    const updateUseCase = new UpdateProductUseCase(repo);
    const deleteUseCase = new DeleteProductUseCase(repo);

    controller = new ProductsController(
      createUseCase,
      listUseCase,
      getUseCase,
      updateUseCase,
      deleteUseCase
    );
  });

  it('should create product', async () => {
    const result = await controller.create({ sku: 'SKU1', name: 'Laptop', price: 99900, stock: 10 });
    expect(result.sku).toBe('SKU1');
  });

  it('should list products', async () => {
    await controller.create({ sku: 'SKU1', name: 'Laptop', price: 99900, stock: 10 });
    const result = await controller.list({ page: 1, pageSize: 10 });
    expect(result.items).toHaveLength(1);
  });
});
