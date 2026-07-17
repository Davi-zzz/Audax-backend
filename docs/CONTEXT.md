# CONTEXT.md — Teste Técnico: CRUD de Produtos com DDD/Hexagonal

## Linguagem Ubíqua

- **Product**: entidade do domínio representando um produto no catálogo
- **Sku**: value object imutável, identificador único de produto (3+ chars, alfanumérico)
- **Price**: value object representando preço em centavos (inteiro > 0)
- **Stock**: quantidade disponível (inteiro >= 0)
- **ProductRepository**: porta (interface) que abstrai persistência de produtos
- **Use Case**: orquestrador de lógica de aplicação, coordena domínio e infraestrutura
- **Adapter**: implementação concreta de uma porta (ex: PrismaProductRepository, InMemoryProductRepository)

## Regras de Negócio

1. **SKU Único**: não há dois produtos com o mesmo SKU. Checagem na aplicação
   (CreateProductUseCase); defesa em profundidade na infra (constraint no banco).

2. **SKU Imutável**: SKU não pode ser alterado após criação. Motivo: reduzir complexidade de
   re-validação de unicidade em updates e manter identidade estável do produto.

3. **Preço Válido**: preço deve ser > 0 (em centavos).

4. **Estoque Válido**: estoque deve ser >= 0.

## Limites do Domínio

- Produtos: criar, listar, buscar, atualizar (nome/preço/estoque, não SKU), remover.
- Sem carrinhos, pedidos, vendas — apenas CRUD de catálogo.
- Sem autenticação, permissões, soft-delete — trata remoção como exclusão física.

## Por Que Hexagonal?

- **Isolamento**: regras de negócio (domínio) não conhecem Nest, Prisma ou detalhes HTTP.
- **Testabilidade**: domínio e casos de uso testados sem banco ou framework.
- **Flexibilidade**: adaptar persistência (in-memory → Postgres) sem tocar código de negócio.
- **Escalabilidade**: adicionar novos adapters (gRPC, GraphQL, etc.) sem impactar domínio.

## Stack Confirmado

- **Monorepo**: pnpm workspaces
- **Backend**: NestJS + TypeScript + Jest
- **Frontend**: Next.js 14+ (App Router) + TypeScript
- **Persistência**: Prisma (Postgres via Docker Compose para dev)
- **Testes de domínio/aplicação**: Jest (sem banco, sem HTTP)

## Decisões de Design Registradas

- [ADR-0001](./adr/0001-monorepo-tool.md) — pnpm workspaces
- [ADR-0002](./adr/0002-hexagonal-architecture.md) — arquitetura hexagonal em 3 camadas
- [ADR-0003](./adr/0003-persistence-strategy.md) — in-memory + Postgres (dois adapters)
- [ADR-0004](./adr/0004-sku-immutability.md) — SKU imutável após criação
- [ADR-0005](./adr/0005-tdd-scope.md) — escopo rigoroso de red-green-refactor
