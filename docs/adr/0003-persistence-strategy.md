# ADR-0003: Estratégia de Persistência — In-Memory + Postgres (Dois Adapters)

## Contexto

Enunciado: "deve ser possível trocar repositório (in-memory → Postgres) sem tocar domínio".
Precisa provar isso implementando dois adapters da mesma porta ProductRepository.

## Decisão

Implementar **dois adapters concretos** da interface `ProductRepository`:

1. **InMemoryProductRepository** — array em memória, usado em testes de domínio/aplicação
2. **PrismaProductRepository** — persistência real via Prisma + Postgres

Ambos implementam a mesma interface; trocar é apenas injetar um ou outro no módulo.

## Detalhes de Implementação

### InMemoryProductRepository
```typescript
export class InMemoryProductRepository implements ProductRepository {
  private products: Map<string, Product> = new Map();
  
  async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }
  
  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }
  
  async findBySku(sku: Sku): Promise<Product | null> {
    return Array.from(this.products.values()).find(p => p.sku.equals(sku)) ?? null;
  }
  
  async findAll(page: number, pageSize: number): Promise<{items: Product[], total: number}> {
    const products = Array.from(this.products.values());
    const start = (page - 1) * pageSize;
    return {
      items: products.slice(start, start + pageSize),
      total: products.length
    };
  }
  
  async remove(id: string): Promise<void> {
    this.products.delete(id);
  }
}
```

### PrismaProductRepository
```typescript
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) {}
  
  async save(product: Product): Promise<void> {
    await this.prisma.product.upsert({
      where: { id: product.id },
      update: { name: product.name, price: product.price.value, stock: product.stock },
      create: {
        id: product.id,
        sku: product.sku.value,
        name: product.name,
        price: product.price.value,
        stock: product.stock
      }
    });
  }
  
  // ... resto das queries
}
```

### Postgres Schema (Prisma)
```prisma
model Product {
  id    String @id
  sku   String @unique
  name  String
  price Int    // em centavos
  stock Int
}
```

Constraint `@unique` em SKU garante defesa em profundidade (além da checagem no use case).

## Testes

- **Testes de domínio/caso de uso**: usam InMemoryProductRepository, rodam em milissegundos, sem banco.
- **Testes de integração** (opcional, fora do escopo de TDD rigoroso): usam PrismaProductRepository com banco test.

## Trade-offs

- **Duplicação**: dois adapters implementam métodos similares. Vale a pena para demonstrar a troca.
- **Sem migrações automáticas**: Prisma precisa de migration manual (`prisma migrate dev`). Documentar no README.

## Referências

- Prisma: https://www.prisma.io/
- Ports & Adapters: https://alistair.cockburn.us/hexagonal-architecture/
