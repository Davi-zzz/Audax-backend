# ADR-0005: Escopo do Rigor de TDD (Red-Green-Refactor) Dado o Prazo

## Contexto

Enunciado exige TDD com red-green-refactor **visível no histórico de commits** em "fatias verticais".
Prazo apertado (~8h total, com partes hoje e amanhã).

Aplicar red-green-refactor em *tudo* (5 use cases + VOs + errors) consumiria ~4-5 horas só de commit/test overhead.

## Decisão

**Aplicar red-green-refactor rigoroso (separado em commits) apenas na regra de negócio central**:
- Sku VO (validação)
- Price VO (validação)
- Product Entity
- CreateProductUseCase (unicidade de SKU)

**Demais casos de uso (List, Get, Update, Delete)**: test-first (teste antes de código), mas commits
podem ser menos separados se refactor é mínimo:
- `test: List deve retornar produtos paginados (red)` → `feat: implementa List com paginação (green)`
- Se houver refactor óbvio (ex: extrair validação de paginação), faz commit separado; senão, bundla.

Todos os testes são de domínio/aplicação (sem banco, sem HTTP), como o enunciado pede.

## Justificativa

1. **Enunciado pede**: "ciclo visível em commits", mas não especifica TODOS os commits. Interpreta-se como
   "demonstrar o ciclo claramente em partes-chave (domínio)", não "cada linhas de código".

2. **Prazo**: economiza ~2-3h de overhead de commit/refactor em casos de uso simples (Get, Delete não têm
   lógica complexa).

3. **Mantém rigor onde importa**: regra de negócio central (Sku/Price/unicidade) sai com histórico impecável.

4. **Documentado**: decisão registrada aqui e no README, não é omissão silenciosa.

## Implementação

### Red-Green-Refactor Rigoroso (central)
```
commit 1: test: Sku deve rejeitar valor vazio (red)
commit 2: feat: valida Sku obrigatório (green)
commit 3: refactor: extrai validação de Sku para método privado
commit 4: test: Sku deve aceitar 3+ chars alfanuméricos (red)
commit 5: feat: valida comprimento e caracteres de Sku (green)
... repete para Price, depois para CreateProductUseCase
```

### Test-First Simples (demais casos)
```
commit N: test: List deve retornar produtos paginados (red)
commit N+1: feat: implementa ListProductsUseCase e paginação (green)
// Refactor mínimo: nada a extrair para SolidCode

commit N+2: test: Get deve retornar produto por ID ou null (red)
commit N+3: feat: implementa GetProductUseCase (green)
```

## Trade-offs

- **Menos commits em List/Get/Update/Delete**: mas ainda prova test-first.
- **Menos refactor**: mas esses casos de uso são simples, refactor seria overhead desnecessário.

## Verificação

`git log --oneline` mostra:
- Red-green-refactor detalhado em Sku → Price → Product → Create
- Test-first (red → green) em List/Get/Update/Delete
- Nenhum commit sem teste correspondente

## Referências

- Red-Green-Refactor: https://martinfowler.com/bliki/TestDrivenDevelopment.html
