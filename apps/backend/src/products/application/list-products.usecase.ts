import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../domain/product.repository';

export class ListProductsInput {
  page: number = 1;
  pageSize: number = 10;
}

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: ListProductsInput) {
    const { items, total } = await this.productRepository.findAll(input.page, input.pageSize);
    return { items, total, page: input.page, pageSize: input.pageSize };
  }
}
