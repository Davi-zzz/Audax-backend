export class Sku {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('SKU is required');
    }
    if (value.length < 3) {
      throw new Error('SKU must have at least 3 characters');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Sku): boolean {
    return this._value === other._value;
  }
}
