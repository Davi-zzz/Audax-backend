import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { CreateProductUseCase } from "../application/create-product.usecase";
import { ProductRepository } from "../domain/product.repository";
import { randomUUID } from "crypto";

@Injectable()
export class ProductsSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProductsSeeder.name);

  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly repository: ProductRepository,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.SEED_DEMO !== "true") {
      return;
    }

    const { total } = await this.repository.findAll(1, 1);

    if (total > 0) {
      this.logger.log("Seed skipped: repository already contains products.");
      return;
    }

    const products = [
      {
        sku: "TEC-001",
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with brown switches.",
        price: 299.9,
        stock: 25,
      },
      {
        sku: "TEC-002",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse.",
        price: 149.9,
        stock: 40,
      },
      {
        sku: "TEC-003",
        name: '27" Monitor',
        description: "IPS monitor with 144Hz refresh rate.",
        price: 1299.9,
        stock: 12,
      },
      {
        sku: "TEC-004",
        name: "USB-C Hub",
        description: "7-in-1 USB-C adapter.",
        price: 179.9,
        stock: 35,
      },
      {
        sku: "TEC-005",
        name: "Laptop Stand",
        description: "Aluminum adjustable stand.",
        price: 119.9,
        stock: 18,
      },
      {
        sku: "TEC-006",
        name: "Webcam",
        description: "1080p USB webcam.",
        price: 249.9,
        stock: 22,
      },
      {
        sku: "TEC-007",
        name: "Bluetooth Speaker",
        description: "Portable Bluetooth speaker.",
        price: 349.9,
        stock: 16,
      },
      {
        sku: "TEC-008",
        name: "Gaming Headset",
        description: "Surround gaming headset.",
        price: 399.9,
        stock: 20,
      },
      {
        sku: "TEC-009",
        name: "External SSD",
        description: "1TB USB 3.2 SSD.",
        price: 699.9,
        stock: 14,
      },
      {
        sku: "TEC-010",
        name: "Notebook Backpack",
        description: "Water resistant backpack.",
        price: 189.9,
        stock: 30,
      },
      {
        sku: "TEC-011",
        name: "HDMI Cable",
        description: "2m HDMI 2.1 cable.",
        price: 49.9,
        stock: 60,
      },
      {
        sku: "TEC-012",
        name: "Power Bank",
        description: "20000mAh fast charging power bank.",
        price: 229.9,
        stock: 15,
      },
    ];

    for (const product of products) {
      await this.createProduct.execute({ id: randomUUID(), ...product });
    }

    this.logger.log(`${products.length} demo products seeded.`);
  }
}
