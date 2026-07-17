# ADR-0006: UseCase Pattern + Docker Dual-Mode (Cache vs. Integration)

## Contexto

O teste técnico pede hexagonal architecture com casos de uso. Em NestJS, há potencial duplicação:
- Service (NestJS padrão) já orquestra lógica
- UseCase (Clean Architecture padrão) também orquestra

Além disso, precisamos suportar dois modos de execução:
1. **Cache Mode**: in-memory repository, sem Postgres, rápido para testes/dev
2. **Integration Mode**: Postgres via Docker, teste completo com BD real

## Decisão

### UseCase Pattern
Implementar **UseCase com @Injectable()** mesmo que pareça redundante com Service:
- UseCase recebe porta (ProductRepository interface)
- Controller injeta UseCase
- Resultado: código agnóstico a framework em camada de aplicação (satisfaz o teste)

Trade-off: duplicação conceitual, mas atende requisito de arquitetura hexagonal.

### Docker Dual-Mode
Criar docker-compose com variável de ambiente `MODE`:
- `MODE=cache`: nenhum serviço Postgres; backend usa InMemoryRepository
- `MODE=integration`: sobe Postgres; backend usa PrismaRepository

Implementar em `docker-compose.yml`:
```yaml
services:
  postgres:
    # conditional: only if MODE=integration
    image: postgres:16-alpine
    # ...

# Start command depends on MODE:
# - cache: npm run start (usa InMemory)
# - integration: npm run prisma:migrate && npm run start (usa Postgres)
```

Backend lê `REPOSITORY_TYPE` env var e injeta adapter apropriado no módulo.

## Trade-offs

- **UseCase**: padrão conceitual redundante, mas atende requisito
- **Docker Modes**: complexidade em configuração, mas flexibilidade em dev/test

## Referências
- Hexagonal Architecture: [[0002-hexagonal-architecture]]
- Persistence Strategy: [[0003-persistence-strategy]]
