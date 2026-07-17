import { ProductsSeeder } from './products.seeder';
import { CreateProductUseCase } from '../application/create-product.usecase';
import { InMemoryProductRepository } from './persistence/in-memory-product.repository';

describe('ProductsSeeder', () => {
  let repository: InMemoryProductRepository;
  let seeder: ProductsSeeder;
  const originalSeedDemo = process.env.SEED_DEMO;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    seeder = new ProductsSeeder(new CreateProductUseCase(repository), repository);
  });

  afterEach(() => {
    if (originalSeedDemo === undefined) {
      delete process.env.SEED_DEMO;
    } else {
      process.env.SEED_DEMO = originalSeedDemo;
    }
  });

  it('should seed at least 12 demo products into an empty repository when SEED_DEMO=true', async () => {
    process.env.SEED_DEMO = 'true';

    await seeder.onApplicationBootstrap();

    const { total } = await repository.findAll(1, 100);
    expect(total).toBeGreaterThanOrEqual(12);
  });

  it('should not duplicate products when repository is already populated', async () => {
    process.env.SEED_DEMO = 'true';

    await seeder.onApplicationBootstrap();
    const { total: afterFirstRun } = await repository.findAll(1, 100);

    await seeder.onApplicationBootstrap();
    const { total: afterSecondRun } = await repository.findAll(1, 100);

    expect(afterSecondRun).toBe(afterFirstRun);
  });

  it('should not seed when SEED_DEMO is not set', async () => {
    delete process.env.SEED_DEMO;

    await seeder.onApplicationBootstrap();

    const { total } = await repository.findAll(1, 100);
    expect(total).toBe(0);
  });
});
