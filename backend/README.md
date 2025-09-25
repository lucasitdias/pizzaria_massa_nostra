LEIA ME!!!
---
# 🍕 Pizzaria Massa Nostra — Backend

Este é o backend da aplicação da Pizzaria Massa Nostra, desenvolvido com Node.js, Express, TypeScript e Prisma ORM. A arquitetura foi pensada para ser modular, escalável e fácil de manter, com foco em organização, segurança e clareza de código.

---
## 📑 Índice do Projeto


### 🔖 Informações Gerais
- 📌 [Status do Projeto](#-status-do-projeto)
- 🧾 [Sobre o Projeto](#-sobre-o-projeto)
- 🧰 [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- ⚙️ [Funcionalidades](#-funcionalidades)
- 🧱 [Estrutura de Pastas](#-estrutura-de-pastas)

### 🧪 Backend e Execução
- 🐳 [Banco de Dados com Docker](#-banco-de-dados-com-docker)
- ⚙️ [Configuração do Projeto](#-configuração-do-projeto)
- 🚀 [Como Rodar o Projeto](#-como-rodar-o-projeto)
- 🧪 [Exemplos de Requisição](#-exemplos-de-requisição)
- 📚 [Documentação da API](#-documentação-da-api)

### 🎨 Interface e Colaboração
- 🖥️ [Frontend (em desenvolvimento)](#-frontend-em-desenvolvimento)
- 🎨 [Design e Protótipos](#-design-e-protótipos)
- 🤝 [Contribuições](#-contribuições)
- 🗺️ [Roadmap](#-roadmap)
- 📄 [Licença](#-licença)
---

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/github/license/lucasitdias/pizzaria-massa-nostra)
![GitHub repo size](https://img.shields.io/github/repo-size/lucasitdias/pizzaria-massa-nostra)
![GitHub last commit](https://img.shields.io/github/last-commit/lucasitdias/pizzaria-massa-nostra)

---

## 🧾 Sobre o Projeto

O **Pizzaria Massa Nostra** é um sistema web completo que implementa o funcionamento de uma pizzaria, contemplando desde o cadastro de produtos até o gerenciamento completo de pedidos.

Este projeto foi idealizado como uma ferramenta de aprendizado, aplicando boas práticas de desenvolvimento, arquitetura limpa, componentização eficiente e integração com APIs, visando escalabilidade e manutenção facilitada.

---

## 🧰 Tecnologias Utilizadas

* Node.js
* Express
* JavaScript
* TypeScript
* Prisma ORM
* PostgreSQL
* Docker
* JWT (autenticação)
* Git e GitHub
* Insomnia (testes de API)

---

## ⚙️ Funcionalidades

### Backend

* Cadastro de clientes, fornecedores e insumos
* Cadastro de pizzas e bebidas
* Sistema de carrinho de compras
* Tela de checkout com resumo do pedido
* Emissão de comprovantes
* Relatório de vendas detalhado
* Painel administrativo para gerenciamento de produtos
* Integração com API de pagamento (simulada)
* Documentação técnica e endpoints da API
* Responsividade e segurança básica implementadas

### Frontend

* Interface intuitiva para clientes e administradores (em desenvolvimento)
* Navegação responsiva para dispositivos móveis
* Exibição dinâmica de cardápio e status dos pedidos
* Fluxo completo de pedido até pagamento (em construção)

---

## 🎨 Design e Protótipos

O layout foi inspirado em pizzarias tradicionais com um toque moderno. Protótipos criados no Xmind:

🔗 Xmind Web
[Link para o Xmind Web:](https://app.xmind.com/i1oZXdIu)

🔗 Google Drive
[Link para o Xmind Google Drive:](https://drive.google.com/drive/folders/1g8v4Cov09FEEra-dL3u2ta-Y5LcmJxbH?usp=sharing)

> Em breve: imagens de layout e preview da interface.

---
## 📁 Estrutura de Pastas

```bash
pizzaria-massa-nostra/

backend/
├── .vscode/                      # Configurações do VSCode
├── dist/                         # Arquivos compilados (TypeScript → JavaScript)
├── node_modules/                 # Dependências instaladas
├── prisma/                       # Configuração do Prisma ORM
│   ├── migrations/               # Histórico de migrações do banco
│   ├── schema.prisma             # Definição dos modelos de dados
│   └── migration_lock.toml       # Lockfile de migrações
├── src/                          # Código-fonte principal
│   ├── __tests__/                # Testes automatizados
│   ├── @types/                   # Tipagens personalizadas
│   ├── config/                   # Configurações gerais (ex: Prisma)
│   ├── controllers/              # Lógica de negócio das rotas
│   ├── data/                     # Dados fixos (pizzas, bebidas, etc.)
│   ├── docs/                     # Documentação interna do projeto
│   ├── middlewares/             # Autenticação, autorização e validações
│   ├── models/                   # DTOs e interfaces de dados
│   ├── prisma/                   # Scripts relacionados ao Prisma
│   ├── routes/                   # Definição das rotas da API
│   ├── seed/                     # Scripts para popular o banco
│   ├── services/                 # Regras de negócio e manipulação de dados
│   ├── types/                    # Tipos auxiliares
│   ├── utils/                    # Funções utilitárias
│   ├── app.ts                    # Configuração principal do Express
│   ├── index.ts                  # Ponto de entrada da aplicação
│   ├── testeAutorizar.ts        # Teste manual de autorização
│   └── testeMiddleware.ts       # Teste manual de middleware
├── .env                          # Variáveis de ambiente
├── .gitignore                    # Arquivos ignorados pelo Git
├── docker-compose.yml           # Configuração de containers (ex: banco de dados)
├── package.json                  # Dependências e scripts do projeto
├── package-lock.json             # Lockfile do npm
├── tsconfig.json                 # Configuração do TypeScript
└── README.md                     # Documentação principal do projeto

```
---

## ⚙️ Funcionalidades

### Backend

- Cadastro de clientes, fornecedores, pizzas e bebidas
- Sistema de carrinho e checkout
- Emissão de comprovantes
- Relatórios de vendas
- Integração com API de pagamento (simulada)
- Segurança básica e validações

### Frontend

- Interface intuitiva para clientes e administradores
- Navegação responsiva
- Exibição dinâmica do cardápio
- Fluxo completo de pedido até pagamento (em construção)

---

## ⚙️ Ambiente de Desenvolvimento - Backend

Passo a passo em como preparar o ambiente local para rodar o backend do projeto **Pizzaria Massa Nostra**.

---
### 📋 Requisitos de Software

Antes de iniciar, certifique-se de ter os seguintes programas instalados:

| Ferramenta         | Versão recomendada |
|--------------------|--------------------|
| Node.js            | 18.x ou superior   |
| npm                | 9.x ou superior    |
| Docker + Compose   | 24.x / 2.x         |
| Git                | Última versão      |

---
## 🧩 Instalação e Execução

💻 Instalação no Windows

1. Baixe e instale o **[Node.js LTS]** (https://nodejs.org/)** (18 ou superior).

* Necessário para rodar a API

2. Instale o **[Git](https://git-scm.com/download/win)**.

* Necessário para clonar o repositório

3. Baixe e instale o **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**.

Usado para rodar o PostgreSQL, já o Docker Compose orquestra os containers.

Obs:   * Durante a instalação, habilite o **WSL 2**.

4. Após instalar, reinicie o computador e teste os comandos no terminal (PowerShell ou Git Bash):

   ```bash
   node -v
   npm -v
   git --version
   docker --version
   docker-compose --version
   ```
---

### 🐧 Instalação no Linux (Ubuntu/Debian ou distros derivadas)

Execute os comandos abaixo no terminal:

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar Node.js e npm
sudo apt install -y nodejs npm

# Instalar Git
sudo apt install -y git

# Instalar Docker
sudo apt install -y docker.io docker-compose

# Verificar versões
node -v
npm -v
git --version
docker --version
docker-compose --version
```
---

## ⚙️ Estrutura e Configuração do Backend

Esta seção descreve os passos realizados para a criação e configuração do backend do projeto **Pizzaria Massa Nostra**.

### 📁 Estrutura Inicial do Projeto

> Caminho base no windows: `/pasta com nome do seu usuario/lucas/pizzaria-massa-nostra/backend`
> Caminho base no linux: `/home/lucas/pizzaria-massa-nostra/backend`

#### 1. Inicialização do Projeto

```bash
npm init -y
```

Criação da pasta `src` na raiz do projeto:

```bash
mkdir src
```

Instalação das dependências e devDependencies:

```bash
npm install express
npm install prisma
npm install typescript ts-node-dev @types/node @types/express --save-dev
```
---

### 2. Configuração do TypeScript

Inicialização do TypeScript:

```bash
npx tsc --init
```
Abaixo está uma configuração recomendada para projetos Node.js com TypeScript, focada em segurança, modularidade e compatibilidade com ESM. Ela foi ajustada para garantir uma base sólida tanto em desenvolvimento quanto em produção.

Ajuste sugerido no `tsconfig.json`:

```json
{
  "compilerOptions": {
    // File Layout
    "rootDir": "./src", // Diretório raiz dos arquivos TypeScript
    "outDir": "./dist", // Diretório de saída dos arquivos compilados
    "module": "nodenext", // Usa o sistema de módulos moderno do Node.js (ESM/CJS com suporte a package.json "exports")
    "target": "es2020", // Compila para a versão mais recente do ECMAScript
    "lib": ["esnext"], // Usa bibliotecas ESNext
    "types": ["node"], // Inclui definições de tipo para Node.js
    "moduleResolution": "nodenext", // Usa resolução moderna compatível com ESM e package.json "exports"
    "esModuleInterop": true, // Permite importar módulos CommonJS com `import`
    // Other Outputs
    "sourceMap": true, // Gera arquivos .map para facilitar debugging
    "declaration": true, // Gera arquivos .d.ts com declarações de tipos
    "declarationMap": true, // Gera mapas para os arquivos de declaração
    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true, // Verifica acessos por índice em arrays e objetos
    "exactOptionalPropertyTypes": true, // Torna tipos opcionais mais precisos
    "strict": true, // Ativa todas as verificações estritas do TypeScript
    "jsx": "react-jsx", // Usa a nova transformação JSX do React (React 17+)
    "isolatedModules": true, // Trata cada arquivo como módulo isolado
    "noUncheckedSideEffectImports": true, // Evita importações com efeitos colaterais não verificados
    "moduleDetection": "force", // Força detecção de módulos mesmo sem import/export
    "skipLibCheck": true // Ignora verificação de tipos em arquivos de biblioteca
  },
  "include": ["src", "tsconfig.dev.json"], // Garante que apenas o código da pasta src seja compilado
  "exclude": ["node_modules"] // Evita que dependências sejam analisadas
}
```
---

## 🔑 Configuração de como rodar o projeto localmente

Este guia mostra passo a passo como configurar e executar o projeto **Pizzaria Massa Nostra** em sua máquina local.

---

### 📦 1. Clone o repositório

```bash
git clone https://github.com/lucasitdias/pizzaria-massa-nostra
```
Clona o projeto do GitHub para sua máquina local, criando uma cópia completa do repositório.

---

### 📁 2. Acesse a pasta do projeto

```bash
cd pizzaria-massa-nostra
```

Entre na pasta do backend para executar os comandos relacionados ao Prisma e ao servidor:

```bash
cd backend
```
---

### 📝 3. Crie e Configure o arquivo `.env`

Crie um arquivo `.env` dentro da pasta `backend` com este conteúdo:

```env
DATABASE_URL="postgresql://lucas:123mudar@localhost:5434/pizzaria_massa_nostra_db?schema=public"
```
* `postgres:postgres` → usuário e senha padrão definidos no `docker-compose.yml`.
* `5434:5432` → porta exposta pelo container do PostgreSQL.
* `pizzaria` → nome do banco de dados.
* `PORT=3000` → porta onde a API será executada.

Define variáveis de ambiente usadas pelo backend, como a URL de conexão com o banco de dados e a porta do servidor.

---

### 📥 4. Instale as dependências

```bash
npm install
```
Instala todos os pacotes necessários definidos no package.json, como Express, Prisma, etc.

* Certifique-se de que você tenha o Node.js e o npm instalados.

---

### 🐳 5. Suba o banco de dados com Docker

O banco de dados **PostgreSQL** roda em container Docker.

Subir o container:
```bash
docker-compose up -d
```
Inicia o container do PostgreSQL em segundo plano, conforme definido no docker-compose.yml.

Parar o container:
```bash
docker-compose down
```
---

### 🧱 6. Inicialização do Prisma e as migrações do Prisma

```bash
npx prisma init
```
Isso criará:

* Pasta `prisma/`
* Arquivo `schema.prisma` para modelagem dos dados
* Arquivo `.env` com a variável `DATABASE_URL`

```bash
npm run prisma:migrate
```
Cria as tabelas no banco de dados com base no schema definido em schema.prisma.

> 📌 *Esse comando aplica as migrações necessárias no banco de dados.*
---

### 🔁 7. Gere o Prisma Client

```bash
npm run prisma:generate
```
Gera o cliente Prisma com base no schema, permitindo que o backend interaja com o banco de forma tipada.

> 🔄 *Esse passo é essencial para garantir que o código gerado esteja em conformidade com o schema.*

---

### 🌐 8. (Opcional) Acesse o Prisma Studio

Se quiser visualizar e interagir com o banco de dados de forma gráfica, use:

```bash
npm run prisma:studio
```
> 🖥️ *O Prisma Studio abrirá uma interface visual para manipular os dados diretamente no navegador.*

---

### ▶️ 9. Inicie o servidor

```bash
npm run dev
```
Inicia o servidor em modo de desenvolvimento, com recarregamento automático a cada alteração.

---

### 🏗️ 10. Executar em produção (opcional)

```bash
npm run build
npm start
```
Compila o projeto para produção (build) e inicia o servidor com o código otimizado (start).

---

### 📦 Scripts recomendados no `package.json` do projeto

```json

"scripts": {
  "npm run dev": "ts-node-dev src/index.ts",        // Executa em modo desenvolvimento com recarga automática
  "npm run build": "tsc",                           // Compila o TypeScript para JavaScript
  "npm start": "node dist/index.js",            // Executa o projeto compilado em produção
  "prisma:migrate": "prisma migrate dev",   // Executa migrações do Prisma
  "prisma:generate": "prisma generate",     // Gera o Prisma Client
  "prisma:studio": "prisma studio"          // Abre a interface do Prisma Studio
}
```
---

### Dicas Adicionais

* **Use scripts no `package.json`** para facilitar os comandos do Prisma (exemplo abaixo).
* **Mantenha o `.env` fora do versionamento**, utilizando `.gitignore`.
* **Adicione validações e middlewares** logo no início para manter o projeto escalável.

---

### 🛠️ Comandos Úteis com Prisma

Após definir os modelos no `schema.prisma`, utilize os seguintes comandos:

|         Comando          |                    Função                       |
| ------------------------ | ----------------------------------------------- |
| `npx prisma migrate dev` | Cria e aplica migrações no banco de dados       |
| `npx prisma generate`    | Gera o Prisma Client com base no schema         |
| `npx prisma studio`      | Abre uma interface visual para o banco de dados |

---

### ⚙️ Comandos para Atualizar o Repositório no GitHub

Antes de tudo, abra seu terminal em modo Bash.

- No Linux, o Bash já é nativo.
- No Windows, você pode instalar o Git Bash ou utilizar o terminal integrado do VS Code.

Agora veja os passos para versionar e enviar suas alterações ao repositório remoto no GitHub:

Certifique-se de estar na raiz do seu projeto (por exemplo, dentro da pasta `backend/`) antes de rodar os comandos.

---

📌 1. Cria uma nova branch com nome padronizado, partindo da branch atual (geralmente main ou dev)

```bash
git checkout -b feat/minha-feature
```
#   Prefixos recomendados:

```
# - feat/ → nova funcionalidade
# - fix/ → correção de bug
# - refactor/ → melhoria de código
# - docs/ → alterações na documentação
```
---
📌 2. Adicionar os arquivos alterados ao controle de versão

```bash
git add .
```
Isso adiciona todos os arquivos modificados para o próximo commit.

---

📝 3. Criar um commit com mensagem descritiva

```bash
git commit -m "feat: adiciona novas funcionalidades de cadastro"
```
Altere o texto dentro das aspas para descrever claramente o que foi alterado.

Exemplos de boas práticas:

- `fix: corrigido bug na conexão com o banco`
- `refactor: organização de pastas e componentes`
- `docs: atualizado README com estrutura de pastas`

---

🚀 4. Enviar as alterações para o repositório remoto

```bash
git push
```
Esse comando envia suas alterações locais para o repositório no GitHub (ou outro provedor remoto configurado).

---

✅ **Projeto pronto para ser executado localmente!**

---

## 📚 Documentação da API

A documentação ainda será disponibilizada.
> Caminho previsto: `http://localhost:3000/docs`

---

## 🧪 Exemplos de Uso

### Criar cliente

```bash
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nomeCompleto":"Lucas Dias","cpf":"12345678901","telefone":"11999999999","email":"lucas@email.com","aceitaPromocoes":true,"aceitaTermos":true,"endereco":{"rua":"Rua A","numero":"123","bairro":"Centro","cep":"13000-000","cidade":"Campinas","pontoReferencia":"Próximo à praça"}}'
```

### Criar pizza

```bash
curl -X POST http://localhost:3000/pizzas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Calabresa","preco":29.9,"ingredientes":"Calabresa, cebola, queijo"}'
```

> Em breve: link para coleção Postman com todos os endpoints.

---

### 📌 Comentários sobre as Melhorias Aplicadas


|              Item                 |                  O que foi melhorado                            |                            Justificativa                                      |
|-----------------------------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------|
| **Títulos e subtítulos**          | Organização em tópicos numerados com emojis temáticos           | Facilita a navegação e o entendimento                                         |
| **Descrição dos comandos**        | Adição de explicações curtas e objetivas abaixo de cada comando | Ajuda iniciantes a entenderem melhor                                          |
| **Tabela de comandos extras**     | Scripts CLI organizados em tabela com nome, função e contexto   | Permite consulta rápida e melhora a legibilidade                              |
| **Informações extras**            | Termos técnicos e instruções organizadas em português claro     | Garante consistência e profissionalismo na documentação                       |
| **Comentários sobre ferramentas** | Notas explicativas sobre Prisma, Docker                         | Ajuda a entender o papel de cada ferramenta no projeto                        |

---

## 🤝 Contribuições

### Recomendações

- Mantenha o código limpo e organizado
- Comente trechos complexos ou que envolvam regras de negócio
- Siga a estrutura de pastas e padrões já definidos no projeto
- Teste localmente antes de enviar
- Evite subir arquivos desnecessários (ex: `.env`, `node_modules` e demais.)

---

### Padrão de Branches

- `feat/` → nova funcionalidade
- `fix/` → correção de bug
- `refactor/` → melhoria de código
- `docs/` → alterações na documentação

---

### Checklist de Pull Request

- [x] Código testado localmente
- [x] Comentários explicativos incluídos
- [x] Estrutura de pastas respeitada
- [x] Sem arquivos sensíveis no commit

---
## 🚦 Status do Projeto e Checklist Técnico

|         Item         | Status |                Observação                   | Última Verificação |
|----------------------|--------|---------------------------------------------|--------------------|
| `package.json`       |   ✅   | Scripts, dependências e ESM configurados    | 12/set/2025        |
| `tsconfig.json`      |   ✅   | Tipagem forte, ESM, build e dev prontos     | 12/set/2025        |
| `.env`               |   ✅   | Conexão com PostgreSQL via Docker           | 12/set/2025        |
| `docker-compose.yml` |   ✅   | Banco rodando na porta 5434                 | 12/set/2025        |
| `schema.prisma`      |   ✅   | Modelos bem definidos e documentados        | 12/set/2025        |
| `migration.sql`      |   ✅   | Tabelas e índices criados com precisão      | 12/set/2025        |
| `index.ts`           |   ✅   | Cadastro de pizza funcionando com Prisma    | 12/set/2025        |

---

## 🗺️ Roadmap

| Módulo             | Status     |
|--------------------|------------|
| Backend            | ⏳ Em desenvolvimento |
| Frontend           | ⏳ Em desenvolvimento |
| API de pagamento   | 🔄 Em planejamento |
| Autenticação       | 🔄 Em planejamento |
| Painel administrativo | 🔄 Em planejamento |

## 🚀 Inicialização

```bash
npm install
npx prisma migrate dev
npm run dev

---

## 📄 Licença

Este projeto está sob a licença **MIT**.
Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
