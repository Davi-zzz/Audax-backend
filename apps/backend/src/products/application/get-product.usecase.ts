import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../domain/product.repository';
import { ProductNotFoundError } from '../domain/product.errors';

@Injectable()
export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new ProductNotFoundError(id);
    return product;
  }
}
