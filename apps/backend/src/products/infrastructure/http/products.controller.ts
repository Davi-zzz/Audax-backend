import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CreateProductUseCase } from '../../application/create-product.usecase';
import { ListProductsUseCase } from '../../application/list-products.usecase';
import { GetProductUseCase } from '../../application/get-product.usecase';
import { UpdateProductUseCase } from '../../application/update-product.usecase';
import { DeleteProductUseCase } from '../../application/delete-product.usecase';
import { CreateProductInput } from '../../application/create-product.usecase';
import { UpdateProductInput } from '../../application/update-product.usecase';
import { ListProductsInput } from '../../application/list-products.usecase';

@Controller('products')
export class ProductsController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private getProductUseCase: GetProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  async create(@Body() input: any) {
    const createInput: CreateProductInput = {
      id: Math.random().toString(36).substring(7),
      sku: input.sku,
      name: input.name,
      price: input.price,
      stock: input.stock,
      description: input.description,
      image: input.image ? Buffer.from(input.image, 'base64') : null,
    };
    const product = await this.createProductUseCase.execute(createInput);
    return this.toDTO(product);
  }

  @Get()
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    const result = await this.listProductsUseCase.execute({ page, pageSize });
    return {
      items: result.items.map(p => this.toDTO(p)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const product = await this.getProductUseCase.execute(id);
    return this.toDTO(product);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: any) {
    const updateInput: UpdateProductInput = {
      id,
      name: input.name,
      price: input.price,
      stock: input.stock,
      description: input.description,
      image: input.image ? Buffer.from(input.image, 'base64') : undefined,
    };
    const product = await this.updateProductUseCase.execute(updateInput);
    return this.toDTO(product);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteProductUseCase.execute(id);
  }

  private toDTO(product: any) {
    return {
      id: product.id,
      sku: product.sku.value,
      name: product.name,
      description: product.description,
      price: product.price.value,
      stock: product.stock,
      image: product.image ? product.image.toString('base64') : null,
      createdAt: product.createdAt,
    };
  }
}
