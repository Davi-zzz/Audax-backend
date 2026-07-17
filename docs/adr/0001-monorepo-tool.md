# ADR-0001: Monorepo Tool — pnpm Workspaces

## Contexto

Projeto necessita de monorepo para coabitar backend (NestJS) e frontend (Next.js) em um repositório único, com possível código compartilhado (tipos).

## Opções Consideradas

1. **pnpm workspaces** — gerenciador de pacotes com linking de workspaces locais
2. **Turborepo** — orquestrador de builds com cache inteligente
3. **Nx** — orquestrador completo com gerador de código e dependency graph

## Decisão

**pnpm workspaces**.

## Justificativa

- **Simplicidade**: configure via `pnpm-workspace.yaml`, sem overhead. Pronto em minutos.
- **Suficiente**: para monorepo simples (2-3 apps), linkagem e `pnpm --filter` são tudo que precisa.
- **Prazo**: não há tempo para setup pesado de Turborepo/Nx (30-60 min de configuração) quando pnpm resolve.
- **Overhead mínimo**: Turborepo/Nx agregam valor em monorepos grandes (10+ packages) com CI custoso; este não.

## Trade-offs

- **Sem cache inteligente de builds** (Turborepo faria isso). Para dev local não importa; CI pode rodar tudo.
- **Sem dependency graph visual** (Nx faria). Arquitetura é simples, não há risco de circular dependencies.

## Referências

- pnpm workspaces: https://pnpm.io/workspaces
