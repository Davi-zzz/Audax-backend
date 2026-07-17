# Teste Técnico — Desenvolvedor (Next + Nest)

CRUD de Produtos com DDD, arquitetura hexagonal, e TDD em um monorepo pnpm.

## Setup

### Pré-requisitos
- Node.js 24+
- pnpm 11+
- Docker + Docker Compose (apenas para modo integração)

### Instalação

```bash
# Ativar pnpm
corepack enable

# Instalar dependências
pnpm install

# Copiar .env.example
cp apps/backend/.env.example apps/backend/.env
```

## Execução

### Modo Cache (in-memory, sem banco)

```bash
# Backend (porta 3000)
pnpm --filter backend start:dev

# Frontend (porta 3001)
pnpm --filter frontend dev
```

**Ideal para**: desenvolvimento rápido, testes unitários, sem setup de BD.

### Modo Integração (Postgres via Docker)

```bash
# Subir Postgres
docker-compose --profile integration up -d

# Rodar migrations Prisma
pnpm --filter backend prisma migrate dev

# Backend (porta 3000)
pnpm --filter backend start:dev

# Frontend (porta 3001)
pnpm --filter frontend dev
```

**Ideal para**: testes de integração, simulação de produção.

## Testes

### Executar todos os testes
```bash
pnpm --filter backend test
```

### Watch mode
```bash
pnpm --filter backend test:watch
```

### Cobertura
```bash
pnpm --filter backend test:cov
```

## Estrutura de Arquitetura

Veja `docs/CONTEXT.md` para linguagem ubíqua e `docs/adr/` para decisões arquiteturais.

### Backend (Hexagonal Architecture)

```
src/products/
├── domain/              # Entidades, Value Objects, Portas, Erros (puro)
│   ├── product.entity.ts
│   ├── sku.vo.ts
│   ├── price.vo.ts
│   ├── product.repository.ts (porta/interface)
│   └── product.errors.ts
├── application/         # Casos de uso (orquestra domínio)
│   ├── create-product.usecase.ts
│   ├── list-products.usecase.ts
│   ├── get-product.usecase.ts
│   ├── update-product.usecase.ts
│   └── delete-product.usecase.ts
└── infrastructure/      # Implementações (adapters)
    ├── http/
    │   └── products.controller.ts
    └── persistence/
        ├── in-memory-product.repository.ts (fake/test adapter)
        └── prisma-product.repository.ts (real adapter)
```

### Decisões de Design

- **ADR-0001**: pnpm workspaces (simplicidade, sem overhead)
- **ADR-0002**: Arquitetura hexagonal em 3 camadas
- **ADR-0003**: Dois adapters de persistência (in-memory + Prisma)
- **ADR-0004**: SKU imutável após criação (reduz complexidade de edge cases)
- **ADR-0005**: TDD red-green-refactor em fatias verticais
- **ADR-0006**: UseCase pattern + Docker dual-mode (cache vs. integração)

## Fluxo de Negócio: Criar Produto

1. **Frontend**: Usuário preenche formulário (nome, SKU, preço, estoque)
2. **HTTP**: POST `/products` → ProductsController
3. **UseCase**: CreateProductUseCase orquestra:
   - Cria Value Objects (Sku, Price) → validações de domínio
   - Checa SKU duplicado via ProductRepository (porta)
   - Cria Product (entidade)
   - Persiste via adapter (in-memory ou Prisma)
4. **Resposta**: DTO de produto criado
5. **Frontend**: Atualiza lista, mostra sucesso

## Regras de Negócio

- **SKU único**: Não há dois produtos com mesmo SKU
- **SKU imutável**: Após criação, não pode ser editado
- **Preço válido**: Deve ser > 0
- **Estoque**: Deve ser >= 0

## Testes

### Cobertura
- ✅ Domínio (VOs, Entity) — testes puros
- ✅ Aplicação (Use Cases) — testes com InMemoryRepository fake
- ✅ HTTP (Controller) — testes com mocks

### O que NÃO foi testado
- ❌ E2E (HTTP request real → BD real) — fora do escopo de TDD rigoroso
- ❌ Infraestrutura/Prisma — adapters são simples, testáveis manualmente

## Git History

Commits seguem padrão red-green-refactor em fatias verticais:
```
test: ProductsController CRUD (red)
feat: implement ProductsController (green)
test: PrismaProductRepository (red)
feat: implement PrismaProductRepository (green)
test: DeleteProductUseCase (red)
feat: implement DeleteProductUseCase (green)
...
```

Cada caso de uso, adapter, e entity tem seu ciclo red-green-refactor separado.

## Próximos Passos (Fora do Escopo)

- [ ] E2E tests com HTTP real + BD real
- [ ] Autenticação/autorização
- [ ] Paginação cursor-based (vs. page/pageSize)
- [ ] Soft-delete (vs. hard delete)
- [ ] API rate limiting
- [ ] Logs/observabilidade
