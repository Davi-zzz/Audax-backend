# ADR-0002: Arquitetura Hexagonal (Ports & Adapters) em 3 Camadas

## Contexto

Enunciado exige arquitetura hexagonal com DDD. Domínio não pode conhecer Nest, ORM ou detalhes de framework.
Deve ser possível trocar persistência (in-memory → Postgres) sem tocar código de negócio.

## Decisão

Organizar backend em **3 camadas concêntricas**:

```
┌─────────────────────────────────────────┐
│  INFRASTRUCTURE (Adapters)              │
│  ├─ HTTP (Controllers, DTOs)            │
│  ├─ Persistence (Repositório impl.)     │
│  └─ ORM (Prisma, query builders)        │
├─────────────────────────────────────────┤
│  APPLICATION (Use Cases)                │
│  ├─ CreateProductUseCase                │
│  ├─ ListProductsUseCase                 │
│  └─ (orquestra domínio + portas)        │
├─────────────────────────────────────────┤
│  DOMAIN (Puro, sem deps externas)       │
│  ├─ Product (Entity)                    │
│  ├─ Sku, Price (Value Objects)          │
│  ├─ ProductRepository (Port/Interface)  │
│  └─ Domain Errors                       │
└─────────────────────────────────────────┘
```

## Regras de Dependência

1. **Domínio é puro**: sem imports de `@nestjs`, Prisma, ou framework.
2. **Aplicação orquestra**: use cases executam lógica de domínio + chamam portas.
3. **Infraestrutura implementa portas**: adapters (Controllers, Repos) dependem de interfaces de aplicação/domínio.

## Implementação

### Domínio (`src/products/domain/`)
- `product.entity.ts` — Product com validações
- `sku.vo.ts`, `price.vo.ts` — Value Objects
- `product.repository.ts` — Interface (porta)
- `product.errors.ts` — DomainException, DuplicateSku, InvalidSku

### Aplicação (`src/products/application/`)
- `create-product.usecase.ts` — orquestra domínio + repositório
- `list-products.usecase.ts`, `get-product.usecase.ts`, etc.
- `dto/` — transfer objects (app boundary)

### Infraestrutura (`src/products/infrastructure/`)
- `http/` — controller NestJS + DTOs de input/output
- `persistence/` — InMemoryProductRepository, PrismaProductRepository

## Benefícios

- **Testabilidade**: domínio testado sem banco (usar InMemoryRepository).
- **Flexibilidade**: trocar Prisma por GraphQL, MongoDB, etc. sem tocar domínio.
- **Clareza**: regras de negócio isoladas, fácil ler/manter.

## Trade-offs

- **Mais camadas**: mais arquivos (`entity`, `usecase`, `controller`). Vale a pena para CRUD com regra de negócio.

## Referências

- Hexagonal Architecture (Alistair Cockburn): https://alistair.cockburn.us/hexagonal-architecture/
- DDD (Eric Evans): domain-driven-design.org
