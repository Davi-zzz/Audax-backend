export class Price {
  constructor(readonly value: number) {
    if (value <= 0) throw new Error('Price must be greater than 0');
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }
}
