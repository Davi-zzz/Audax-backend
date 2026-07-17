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



### Modo Local (pnpm, sem Docker)



#### Cache (in-memory, sem banco)



```bash

# Terminal 1: Backend (porta 3001)

pnpm --filter backend start:dev



# Terminal 2: Frontend (porta 3000)

pnpm --filter frontend dev

```



#### Integração (Postgres via Docker)



```bash

# Subir Postgres

docker-compose --profile integration up -d postgres



# Rodar migrations Prisma

pnpm --filter backend prisma migrate dev



# Terminal 1: Backend (porta 3001)

REPOSITORY_TYPE=prisma pnpm --filter backend start:dev



# Terminal 2: Frontend (porta 3000)

pnpm --filter frontend dev

```



### Modo Docker (Containers)



#### Cache (sem Postgres)



```bash

MODE=cache docker-compose up

```



- Frontend: http://localhost:3000

- Backend: http://localhost:3001



#### Integração (com Postgres)



```bash

MODE=integration docker-compose up

```



- Frontend: http://localhost:3000

- Backend: http://localhost:3001

- Postgres: localhost:5432



Migrations rodam automaticamente (se configurado).



### Resumo



| Modo | Usar | Setup |

|------|------|-------|

| **Local Cache** | Dev rápido, sem BD | `pnpm --filter backend start:dev` |

| **Local Integração** | Testes com BD real | Postgres local + migrations |

| **Docker Cache** | CI/testes containerizados | `MODE=cache docker-compose up` |

| **Docker Integração** | Produção/staging | `MODE=integration docker-compose up` |



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

- **Imagens**: Persistidas como blobs (bytes) no banco; frontend envia base64, backend converte/reconverte



## Testes



### Cobertura

- ✅ Domínio (VOs, Entity) — testes puros

- ✅ Aplicação (Use Cases) — testes com InMemoryRepository fake

- ✅ HTTP (Controller) — testes com mocks



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

## Para acessar mais detalhes, por favor, execute a aplicação e consulte a página de documentação, lá você terá acesso a todas as decisões e motivações.
