# Documentação Técnica — Massa Nostra API

Este diretório contém a documentação técnica da API da pizzaria Massa Nostra.  
Os arquivos aqui organizam e explicam a estrutura do sistema, validações, autenticação, modelagem de dados e exemplos de uso.

---

## Arquivos disponíveis

### `estrutura.md`
Descreve a arquitetura de diretórios e arquivos do projeto.  
Explica o papel de cada pasta (`controllers`, `services`, `schemas`, etc.) e o fluxo de execução da API.

### `modelagem.md`
Documenta todas as entidades do banco de dados com base no `schema.prisma`.  
Inclui campos, tipos, relacionamentos e regras de negócio.

### `auth.md`
Explica como funciona a autenticação via JWT.  
Inclui exemplos de login, uso de token, perfis de acesso e controle de rotas protegidas.

### `arquivodevalidacao.md`
Lista todas as validações aplicadas no sistema, organizadas por entidade.  
Inclui regras de campos obrigatórios, tipos esperados e validações personalizadas com Zod.

### `acessoscriados.md`
Registro dos acessos criados via API.  
Inclui payloads de criação de usuários, headers utilizados e respostas esperadas.

### `json_test_insomnia.md`
Exemplos de requisições JSON para testar os endpoints da API usando Insomnia.  
Inclui headers, payloads e respostas para login, criação de usuários, pedidos, pizzas e mais.

---

## Recomendações

- Todos os arquivos seguem padrão Markdown para facilitar leitura e versionamento.
- A documentação é atualizada conforme alterações no código ou no banco.
- Para gerar novos exemplos ou atualizar validações, consulte os schemas em `src/schemas/` e o banco em `prisma/schema.prisma`.

---

## Objetivo

Facilitar o entendimento técnico do sistema para desenvolvedores, integradores e mantenedores.  
A documentação cobre desde a estrutura do projeto até exemplos práticos de uso da API.

---

