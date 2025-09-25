Aqui está o conteúdo completo e padronizado para o arquivo `src/docs/rodar_aplicação.md`, Lucas — direto ao ponto, sem invenções, e pronto pra uso por qualquer dev que precise subir o projeto:

---

```md
# Como Rodar a Aplicação — Massa Nostra API

Este guia explica como configurar e executar o projeto backend da pizzaria Massa Nostra em ambiente local.

---

## Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (com banco criado)
- [Prisma CLI](https://www.prisma.io/docs) (`npm install prisma --save-dev`)
- [Docker](https://www.docker.com/) (opcional, para ambiente isolado)

---

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/massa-nostra-api.git
   cd massa-nostra-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/massanostra"
   JWT_SECRET="sua_chave_secreta"
   PORT=3000
   ```

---

## Preparar o banco de dados

1. Gerar os modelos do Prisma:
   ```bash
   npx prisma generate
   ```

2. Executar as migrações:
   ```bash
   npx prisma migrate dev --name init
   ```

3. (Opcional) Popular dados fixos:
   ```bash
   npm run seed
   ```

---

## Executar o servidor

```bash
npm run dev
```

A API estará disponível em:  
`http://localhost:3000`

---

## Testar a aplicação

Use ferramentas como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/) para testar os endpoints.  
Consulte o arquivo [`json_test_insomnia.md`](./json_test_insomnia.md) para exemplos prontos.

---

## Problemas comuns

- Erro de conexão com banco: verifique `DATABASE_URL` no `.env`
- Porta ocupada: altere `PORT` no `.env`
- Token inválido: gere novo login via `/login`

---

## Observações

- O projeto usa TypeScript, Prisma ORM e JWT para autenticação.
- Logs são gerados automaticamente via `src/config/logger.ts`
- Auditoria é registrada em todas as ações sensíveis.

---
```