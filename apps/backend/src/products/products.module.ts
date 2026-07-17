import { Module, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ProductsController } from './infrastructure/http/products.controller';
import { CreateProductUseCase } from './application/create-product.usecase';
import { ListProductsUseCase } from './application/list-products.usecase';
import { GetProductUseCase } from './application/get-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { DeleteProductUseCase } from './application/delete-product.usecase';
import { ProductRepository } from './domain/product.repository';
import { InMemoryProductRepository } from './infrastructure/persistence/in-memory-product.repository';
import { PrismaProductRepository } from './infrastructure/persistence/prisma-product.repository';

const repositoryProvider = {
  provide: ProductRepository,
  useFactory: (prisma?: PrismaClient) => {
    const mode = process.env.REPOSITORY_TYPE || 'in-memory';
    if (mode === 'prisma' && prisma) {
      return new PrismaProductRepository(prisma);
    }
    return new InMemoryProductRepository();
  },
  inject: [{ token: 'PrismaClient', optional: true }],
};

@Module({
  controllers: [ProductsController],
  providers: [
    repositoryProvider,
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    {
      provide: 'PrismaClient',
      useValue: new PrismaClient(),
    },
  ],
})
export class ProductsModule {}
