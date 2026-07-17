# ADR-0004: SKU Imutável Após Criação

## Contexto

Produto pode ser atualizado (nome, preço, estoque). SKU também é atualizável em teoria, mas isso complexifica
validação de unicidade: ao atualizar SKU de A para B, precisa checar se B já existe (mesmo problema de
criação). Ao replicar essa lógica em Update + Create, risco de inconsistência.

## Decisão

**SKU é imutável após criação**.

Implicações:
- UpdateProductUseCase aceita: nome, preço, estoque. **Não** aceita SKU.
- Controller HTTP não exibe campo SKU no formulário de edição.
- Banco: Prisma update não toca coluna SKU; controlado a nível de aplicação (UpdateProductUseCase não recebe).

## Justificativa

1. **Simplicidade**: reduz casos de teste (sem re-checagem de unicidade em update).
2. **Identidade**: SKU é a identidade do produto (como CPF); faz sentido ser imutável.
3. **Segurança de domínio**: muda-se name/price (atributos), não identidade.
4. **Prazo**: economia real de 30min de testes/edge cases em um cronograma apertado.

## Trade-offs

- **Menos flexível**: se usuário precisar corrigir SKU, precisa deletar + recriar (solução workaround).
- **Documentar bem**: UX pode ficar confusa se não avisar que SKU não é editável.

## Implementação

```typescript
// UpdateProductUseCase input
export class UpdateProductInput {
  id: string;
  name: string;
  price: number; // em centavos
  stock: number;
  // SKU propositalmente ausente
}

// Controller não tira erro, só ignora SKU se enviado
@Patch('/:id')
async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
  // dto.sku é ignorado ou validado como erro (opcional)
  return this.useCase.execute({ id, name: dto.name, price: dto.price, stock: dto.stock });
}
```

## Referências

- Aggregate Roots & Identities (DDD): enterprise-architecture.org
