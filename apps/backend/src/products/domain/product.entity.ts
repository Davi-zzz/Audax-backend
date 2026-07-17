import { Sku } from './sku.vo';
import { Price } from './price.vo';

export class Product {
  private _name: string;
  private _price: Price;
  private _stock: number;

  constructor(
    private readonly _id: string,
    private readonly _sku: Sku,
    name: string,
    price: Price,
    stock: number
  ) {
    if (stock < 0) throw new Error('Stock cannot be negative');
    this._name = name;
    this._price = price;
    this._stock = stock;
  }

  get id(): string { return this._id; }
  get sku(): Sku { return this._sku; }
  get name(): string { return this._name; }
  get price(): Price { return this._price; }
  get stock(): number { return this._stock; }

  update(name: string, price: Price, stock: number): void {
    if (stock < 0) throw new Error('Stock cannot be negative');
    this._name = name;
    this._price = price;
    this._stock = stock;
  }
}
