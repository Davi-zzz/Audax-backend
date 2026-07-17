import { Sku } from './sku.vo';
import { Price } from './price.vo';

export class Product {
  private _name: string;
  private _price: Price;
  private _stock: number;
  private _description: string;
  private _image: Buffer | null;

  constructor(
    private readonly _id: string,
    private readonly _sku: Sku,
    name: string,
    price: Price,
    stock: number,
    description: string = '',
    image: Buffer | null = null
  ) {
    if (stock < 0) throw new Error('Stock cannot be negative');
    this._name = name;
    this._price = price;
    this._stock = stock;
    this._description = description;
    this._image = image;
  }

  get id(): string { return this._id; }
  get sku(): Sku { return this._sku; }
  get name(): string { return this._name; }
  get price(): Price { return this._price; }
  get stock(): number { return this._stock; }
  get description(): string { return this._description; }
  get image(): Buffer | null { return this._image; }

  update(name: string, price: Price, stock: number, description?: string, image?: Buffer | null): void {
    if (stock < 0) throw new Error('Stock cannot be negative');
    this._name = name;
    this._price = price;
    this._stock = stock;
    if (description !== undefined) this._description = description;
    if (image !== undefined) this._image = image;
  }
}
