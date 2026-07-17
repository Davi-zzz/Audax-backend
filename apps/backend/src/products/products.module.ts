import { Module } from '@nestjs/common';
import { ProductsController } from './infrastructure/http/products.controller';
import { CreateProductUseCase } from './application/create-product.usecase';
import { ListProductsUseCase } from './application/list-products.usecase';
import { GetProductUseCase } from './application/get-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { DeleteProductUseCase } from './application/delete-product.usecase';
import { InMemoryProductRepository } from './infrastructure/persistence/in-memory-product.repository';
import { PrismaProductRepository } from './infrastructure/persistence/prisma-product.repository';
import { PrismaService } from '../prisma.service';

const repositoryFactory = (prisma: PrismaService) => {
  const mode = process.env.REPOSITORY_TYPE || 'in-memory';
  if (mode === 'prisma') {
    return new PrismaProductRepository(prisma as any);
  }
  return new InMemoryProductRepository();
};

@Module({
  providers: [
    PrismaService,
    {
      provide: 'ProductRepository',
      useFactory: repositoryFactory,
      inject: [PrismaService],
    },
    {
      provide: CreateProductUseCase,
      useFactory: (repo) => new CreateProductUseCase(repo),
      inject: ['ProductRepository'],
    },
    {
      provide: ListProductsUseCase,
      useFactory: (repo) => new ListProductsUseCase(repo),
      inject: ['ProductRepository'],
    },
    {
      provide: GetProductUseCase,
      useFactory: (repo) => new GetProductUseCase(repo),
      inject: ['ProductRepository'],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (repo) => new UpdateProductUseCase(repo),
      inject: ['ProductRepository'],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (repo) => new DeleteProductUseCase(repo),
      inject: ['ProductRepository'],
    },
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
