import { Injectable } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import { Sku } from '../domain/sku.vo';
import { Price } from '../domain/price.vo';
import { ProductRepository } from '../domain/product.repository';
import { DuplicateSkuError } from '../domain/product.errors';

export class CreateProductInput {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const sku = new Sku(input.sku);
    const price = new Price(input.price);

    const existing = await this.productRepository.findBySku(sku);
    if (existing) throw new DuplicateSkuError(input.sku);

    const product = new Product(input.id, sku, input.name, price, input.stock);
    await this.productRepository.save(product);
    return product;
  }
}
