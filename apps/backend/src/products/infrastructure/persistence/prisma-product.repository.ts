import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from '../../domain/product.repository';
import { Sku } from '../../domain/sku.vo';
import { Price } from '../../domain/price.vo';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: any) {}

  async save(product: Product): Promise<void> {
    await this.prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        price: product.price.value,
        stock: product.stock,
        description: product.description,
        image: product.image,
      },
      create: {
        id: product.id,
        sku: product.sku.value,
        name: product.name,
        price: product.price.value,
        stock: product.stock,
        description: product.description,
        image: product.image,
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({ where: { id } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({ where: { sku: sku.value } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findAll(page: number, pageSize: number): Promise<{ items: Product[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({ skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.product.count(),
    ]);
    return { items: rows.map(row => this.toDomain(row)), total };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  private toDomain(row: any): Product {
    return new Product(row.id, new Sku(row.sku), row.name, new Price(row.price), row.stock, row.description, row.image);
  }
}
