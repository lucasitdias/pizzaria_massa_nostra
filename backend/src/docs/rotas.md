# Rotas da API — Massa Nostra

Este documento lista os principais endpoints da API, organizados por entidade e funcionalidade.  
Inclui método HTTP, rota, descrição e perfil necessário para acesso.

---

## Autenticação

| Método | Rota         | Descrição               | Perfil |
|--------|--------------|--------------------------|--------|
| POST   | /login       | Realiza login e retorna token | Público |

---

## Usuários

| Método | Rota             | Descrição                      | Perfil     |
|--------|------------------|--------------------------------|------------|
| POST   | /usuarios        | Cria novo usuário              | admin      |
| GET    | /usuarios        | Lista todos os usuários        | admin      |
| GET    | /usuarios/:id    | Consulta usuário por ID        | admin      |
| PUT    | /usuarios/:id    | Atualiza dados do usuário      | admin      |
| DELETE | /usuarios/:id    | Remove usuário                 | admin      |

---

## Clientes

| Método | Rota             | Descrição                      | Perfil     |
|--------|------------------|--------------------------------|------------|
| POST   | /clientes        | Cria novo cliente              | atendente  |
| GET    | /clientes        | Lista todos os clientes        | atendente  |
| GET    | /clientes/:id    | Consulta cliente por ID        | atendente  |
| PUT    | /clientes/:id    | Atualiza dados do cliente      | atendente  |
| DELETE | /clientes/:id    | Remove cliente                 | gerente    |

---

## Endereços

| Método | Rota                   | Descrição                      | Perfil     |
|--------|------------------------|--------------------------------|------------|
| GET    | /enderecos/:clienteId  | Consulta endereço do cliente   | atendente  |

---

## Pizzas

| Método | Rota             | Descrição                      | Perfil     |
|--------|------------------|--------------------------------|------------|
| POST   | /pizzas          | Cria nova pizza                | gerente    |
| GET    | /pizzas          | Lista todas as pizzas          | público    |
| GET    | /pizzas/:id      | Consulta pizza por ID          | público    |
| PUT    | /pizzas/:id      | Atualiza pizza                 | gerente    |
| DELETE | /pizzas/:id      | Remove pizza                   | gerente    |

---

## Pedidos

| Método | Rota             | Descrição                      | Perfil     |
|--------|------------------|--------------------------------|------------|
| POST   | /pedidos         | Cria novo pedido               | atendente  |
| GET    | /pedidos         | Lista todos os pedidos         | gerente    |
| GET    | /pedidos/:id     | Consulta pedido por ID         | gerente    |
| PUT    | /pedidos/:id     | Atualiza status do pedido      | gerente    |
| DELETE | /pedidos/:id     | Cancela pedido                 | gerente    |

---

## Insumos

| Método | Rota             | Descrição                      | Perfil     |
|--------|------------------|--------------------------------|------------|
| POST   | /insumos         | Cadastra novo insumo           | gerente    |
| GET    | /insumos         | Lista todos os insumos         | gerente    |
| PUT    | /insumos/:id     | Atualiza insumo                | gerente    |
| DELETE | /insumos/:id     | Remove insumo                  | gerente    |

---

## Fornecedores

| Método | Rota               | Descrição                      | Perfil     |
|--------|--------------------|--------------------------------|------------|
| POST   | /fornecedores      | Cadastra novo fornecedor       | gerente    |
| GET    | /fornecedores      | Lista todos os fornecedores    | gerente    |
| PUT    | /fornecedores/:id  | Atualiza fornecedor            | gerente    |
| DELETE | /fornecedores/:id  | Remove fornecedor              | gerente    |

---

## Relatórios

| Método | Rota                     | Descrição                      | Perfil     |
|--------|--------------------------|--------------------------------|------------|
| GET    | /relatorios/vendas       | Relatório de vendas            | admin      |
| GET    | /relatorios/estoque      | Relatório de estoque           | admin      |
| GET    | /relatorios/financeiro   | Relatório financeiro           | admin      |

---

## Observações

- Todas as rotas protegidas exigem token JWT no header `Authorization: Bearer <token>`
- Perfis válidos: `admin`, `gerente`, `atendente`, `garçom`
- Rotas públicas