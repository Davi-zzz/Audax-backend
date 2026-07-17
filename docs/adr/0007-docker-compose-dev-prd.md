# ADR-0007: Execução em Containers — docker-compose dev/prd + proxy /api

## Contexto

A ADR-0006 propôs um único `docker-compose.yml` com variável `MODE` (cache vs. integration).
Ao implementar, o modelo evoluiu: em vez de um arquivo com modos condicionais, ficou mais claro
separar os fluxos em dois arquivos compose, cada um apontando para um target do mesmo
Dockerfile multi-stage.

Além disso, o frontend chamando o backend direto (`http://localhost:3001`) exigia CORS e
expunha a URL do backend no bundle do browser.

## Decisão

### 1. Dois arquivos compose

- **`docker-compose-dev.yml`** — target `development` dos Dockerfiles: hot-reload
  (`pnpm dev` com bind mounts do código; `node_modules` em volumes nomeados para não
  conflitar com o host).
- **`docker-compose-prd.yml`** — target `production`: build multi-stage (compila e copia
  apenas artefatos `dist`/`.next`), `node dist/main.js` no backend e `next start` no frontend.

### 2. Proxy `/api` via Next rewrites

O browser fala somente com o frontend (`NEXT_PUBLIC_API_URL=/api`). O Next reescreve
`/api/*` → `http://backend:3000/*` na rede interna do compose (`next.config.js`).

- Elimina CORS (mesma origem para o browser).
- O backend não precisa ser exposto publicamente (a porta 3001 no host é conveniência de debug).
- Exigiu remover `output: 'export'` — rewrites requerem o servidor Next em execução.

### 3. Repositório in-memory como default nos containers

Nenhum compose define serviço Postgres nem seta `REPOSITORY_TYPE`; o backend sobe com
`InMemoryProductRepository` (default do factory em `products.module.ts`). O `PrismaService`
só conecta ao banco quando `REPOSITORY_TYPE=prisma` (conexão condicional, coberta por teste),
então a ausência de Postgres não impede o boot.

O modo Postgres permanece disponível para execução local (ADR-0003):
`REPOSITORY_TYPE=prisma` + `DATABASE_URL` + `prisma migrate dev`.

### 4. Toolchain pinada

- `pnpm@10.34.5` ativado via corepack nos dois Dockerfiles e pinado em
  `"packageManager"` no `package.json` raiz.
- `pnpm-lock.yaml` versionado no repositório — obrigatório para o
  `pnpm install --frozen-lockfile` dos builds Docker serem reproduzíveis.

## Trade-offs

- **Docker não demonstra o modo Postgres out-of-the-box**: a troca de adapter é provada
  pelos testes (mesma porta `ProductRepository`, dois adapters) e pela execução local com
  `REPOSITORY_TYPE=prisma`. Em troca, `docker compose up` funciona com um comando, sem
  migrations nem espera de banco.
- **Dois arquivos compose** duplicam um pouco de configuração, mas tornam explícito qual
  fluxo está sendo executado (dev com hot-reload vs. imagem final).

## Débito conhecido — preço em centavos

O CONTEXT.md e o schema Prisma (`price Int`) definem preço em **centavos inteiros**, mas o
`Price` VO valida apenas `> 0` e o frontend envia **reais com decimais** (ex.: `199.9`).
Em modo in-memory funciona; em modo prisma, um preço decimal seria rejeitado pela coluna
`Int`. Alinhamento (converter reais↔centavos na borda HTTP e validar inteiro no VO) fica
registrado como débito consciente por prazo.

## Referências

- Substitui a seção "Docker Dual-Mode" da [[0006-usecases-and-docker-modes]]
  (a parte "UseCase Pattern" da ADR-0006 permanece válida).
- Estratégia de persistência: [[0003-persistence-strategy]]
- Next.js rewrites: https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites
