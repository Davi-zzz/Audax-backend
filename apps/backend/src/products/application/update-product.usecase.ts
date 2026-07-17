import { Injectable } from '@nestjs/common';
import { Price } from '../domain/price.vo';
import { ProductRepository } from '../domain/product.repository';
import { ProductNotFoundError } from '../domain/product.errors';

export class UpdateProductInput {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: Buffer | null;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: UpdateProductInput) {
    const product = await this.productRepository.findById(input.id);
    if (!product) throw new ProductNotFoundError(input.id);

    const price = new Price(input.price);
    product.update(input.name, price, input.stock, input.description, input.image);
    await this.productRepository.save(product);
    return product;
  }
}
