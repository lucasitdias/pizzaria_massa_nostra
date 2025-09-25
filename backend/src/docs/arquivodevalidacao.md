# Arquivo de Validação — Massa Nostra

Este documento lista todas as validações aplicadas no sistema, organizadas por entidade.  
Inclui regras de campos obrigatórios, tipos esperados, formatos e validações personalizadas.

---

## Usuário (`usuarioSchema`)

- `nome`: string, obrigatório
- `email`: string, obrigatório, formato de e-mail válido
- `senha`: string, obrigatório, mínimo 6 caracteres
- `perfil`: enum → `"admin"`, `"gerente"`, `"atendente"`, `"garçom"`
- `setor`: string, opcional
- `cargo`: string, opcional
- `ativo`: boolean, padrão `true`

Validação extra:  
✔ `validarEmail(email)` — função utilitária que valida formato e domínio

---

## Pizza (`pizzaSchema`)

- `nome`: string, obrigatório
- `precoBase`: number, obrigatório, mínimo `10`
- `ingredientes`: string, obrigatório
- `tamanho`: enum → `"broto"`, `"média"`, `"grande"`, `"família"`
- `tipo`: enum → `"salgada"`, `"doce"`

---

## Insumo (`validarInsumo`)

Validação feita via função utilitária:

- `nome`: obrigatório, mínimo 3 caracteres
- `unidadeMedida`: obrigatório, deve ser `"kg"`, `"g"`, `"ml"`, `"unidade"`
- `precoUnitario`: obrigatório, número positivo
- `validade`: obrigatório, data futura
- `categoria`: obrigatório, string

---

## Pedido (`pedidoSchema`)

- `clienteId`: number, obrigatório
- `itens`: array de objetos, mínimo 1 item
  - `pizzaId`: number, opcional
  - `bebidaId`: number, opcional
  - `quantidade`: number, obrigatório, mínimo `1`
- `formaPagamento`: enum → `"dinheiro"`, `"cartao"`, `"pix"`
- `observacoes`: string, opcional

Validação extra:  
✔ Verificação de existência de `cliente`, `pizza`, `bebida` e `insumos` antes de registrar

---

## Perfil (`perfilSchema`)

- `perfil`: enum → `"admin"`, `"gerente"`, `"atendente"`

---

## Observações

- Todas as validações são feitas com Zod ou funções utilitárias
- Controllers aplicam `safeParse` e retornam `400` com `resultado.error.issues` em caso de erro
- Auditoria é registrada após validação e operação bem-sucedida
- Campos como `senha`, `email`, `preco`, `quantidade` e `validade` têm validações específicas

---

