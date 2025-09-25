# Estrutura do Projeto — Massa Nostra API

Este documento descreve a organização dos diretórios e arquivos do projeto backend da pizzaria Massa Nostra.  
A estrutura foi pensada para garantir clareza, modularidade, segurança e rastreabilidade.

---

## src/

Diretório principal do código-fonte da aplicação.

### controllers/
Contém os arquivos responsáveis por lidar com as requisições HTTP.  
Cada controller representa uma entidade ou funcionalidade do sistema.

- `clienteController.ts`
- `pedidoController.ts`
- `pizzaController.ts`
- `usuarioController.ts`
- `pagamentoController.ts`
- `relatorioController.ts`
- `fornecedorController.ts`
- `fidelidadeController.ts`
- `insumoController.ts`

### services/
Contém a lógica de negócio e operações que não pertencem diretamente ao controller.  
Controllers chamam os services para executar ações complexas.

- `pedidoService.ts`
- `insumoService.ts`
- `clienteService.ts`

### schemas/
Contém os schemas de validação de dados usando Zod.  
São usados nos controllers para validar o `req.body`.

- `usuarioSchema.ts`
- `pizzaSchema.ts`
- `pedidoSchema.ts`
- `fornecedorSchema.ts`

### utils/
Funções utilitárias reutilizáveis em todo o projeto.

- `validadores.ts` — validações genéricas (e-mail, CPF, etc.)
- `erroPadrao.ts` — função para padronizar erros de resposta

### data/
Contém dados fixos usados para popular o sistema ou gerar cardápios.

- `bebidasFixas.ts`
- `pizzasDocesFixas.ts`
- `pizzasSalgadasFixas.ts`

### config/
Configurações globais do projeto.

- `logger.ts` — sistema de logs
- `auth.ts` — configuração de autenticação (middleware, JWT)

### docs/
Documentação técnica do projeto.

- `auth.md` — como funciona a autenticação
- `estrutura.md` — estrutura do projeto (este arquivo)
- `acessoscriados.md` — registro de usuários criados via API
- `arquivodevalidacao.md` — regras de validação por entidade

---

## Outros arquivos importantes

- `package.json` — dependências e scripts
- `tsconfig.json` — configuração do TypeScript
- `.env` — variáveis de ambiente (porta, banco, JWT)
- `prisma/schema.prisma` — definição do banco de dados

---

## Fluxo de execução

1. Requisição chega ao `controller`
2. Validação com `schema` ou `utils`
3. Lógica de negócio no `service`
4. Operações com o banco via `Prisma`
5. Auditoria registrada
6. Resposta enviada ao cliente

---

## Padrões adotados

- Validação com Zod
- Auditoria em todas as ações sensíveis
- Tipagem forte com TypeScript
- Separação clara entre controller, service e schema
- Logs centralizados com `logger.ts`
- Autenticação via JWT com controle de perfil

---

