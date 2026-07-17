import { PrismaProductRepository } from './prisma-product.repository';
import { Product } from '../../domain/product.entity';
import { Sku } from '../../domain/sku.vo';
import { Price } from '../../domain/price.vo';

describe('PrismaProductRepository', () => {
  let repository: PrismaProductRepository;
  let prismaClient: any;

  beforeEach(() => {
    prismaClient = {
      product: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    repository = new PrismaProductRepository(prismaClient);
  });

  it('should save product', async () => {
    const product = new Product('1', new Sku('SKU1'), 'Laptop', new Price(99900), 10);
    await repository.save(product);
    expect(prismaClient.product.create).toHaveBeenCalled();
  });

  it('should find product by id', async () => {
    prismaClient.product.findUnique.mockResolvedValue(null);
    const result = await repository.findById('1');
    expect(result).toBeNull();
  });
});
