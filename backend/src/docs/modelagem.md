# Modelagem de Dados — Massa Nostra API

Este documento descreve a estrutura das entidades do sistema, com base no schema Prisma.

---

## ADMINISTRAÇÃO

### Auditoria

| Campo         | Tipo      | Regras                     |
|---------------|-----------|----------------------------|
| id            | Int       | Chave primária, autoincremento |
| usuario       | String    | Email do autor da ação     |
| funcionarioId | Int       | FK para Usuario            |
| acao          | String    | Descrição da ação          |
| entidade      | String    | Nome da entidade afetada   |
| entidadeId    | Int       | ID da entidade afetada     |
| tipoOperacao  | String    | Tipo da operação realizada |
| ipOrigem      | String    | IP da requisição           |
| dataHora      | DateTime  | Padrão: now()              |
| ativo         | Boolean   | Padrão: true               |

---

### Usuario

| Campo  | Tipo    | Regras                     |
|--------|---------|----------------------------|
| id     | Int     | Chave primária, autoincremento |
| nome   | String  | Obrigatório                |
| email  | String  | Único, obrigatório         |
| senha  | String  | Obrigatório                |
| setor  | String  | Obrigatório                |
| cargo  | String  | Obrigatório                |
| perfil | String  | Obrigatório                |
| ativo  | Boolean | Padrão: true               |

---

## ATENDIMENTO

### Cliente

| Campo             | Tipo      | Regras                     |
|-------------------|-----------|----------------------------|
| id                | Int       | Chave primária, autoincremento |
| nomeCompleto      | String    | Obrigatório                |
| cpf               | String    | Único                      |
| dataNascimento    | DateTime? | Opcional                   |
| telefone          | String    | Obrigatório                |
| telefoneOpcional  | String?   | Opcional                   |
| email             | String    | Único                      |
| observacoes       | String?   | Opcional                   |
| aceitaPromocoes   | Boolean   | Obrigatório                |
| aceitaTermos      | Boolean   | Obrigatório                |
| ativo             | Boolean   | Padrão: true               |
| enderecoId        | Int       | Único                      |
| endereco          | FK        | para EnderecoEntrega       |
| pedidos           | Pedido[]  | Relação 1:N                |

---

### EnderecoEntrega

| Campo             | Tipo    | Regras                     |
|-------------------|---------|----------------------------|
| id                | Int     | Chave primária, autoincremento |
| rua               | String  | Obrigatório                |
| numero            | String  | Obrigatório                |
| complemento       | String? | Opcional                   |
| bairro            | String  | Obrigatório                |
| cep               | String  | Obrigatório                |
| cidade            | String  | Obrigatório                |
| pontoReferencia   | String  | Obrigatório                |
| cliente           | Cliente?| Relação 1:1 opcional       |

---

## COMPRAS

### Fornecedor

| Campo                  | Tipo     | Regras                     |
|------------------------|----------|----------------------------|
| id                     | Int      | Chave primária, autoincremento |
| nomeCompleto           | String   | Obrigatório                |
| contato                | String?  | Opcional                   |
| nacionalidade          | String?  | Opcional                   |
| estadoCivil            | String?  | Opcional                   |
| cpf                    | String   | Único                      |
| cnpj                   | String?  | Único                      |
| rg                     | String   | Único                      |
| inscricaoEstadual      | String?  | Opcional                   |
| email                  | String   | Único                      |
| telefone               | String   | Obrigatório                |
| celular                | String?  | Opcional                   |
| whatsapp               | String?  | Opcional                   |
| telefoneAlternativo    | String?  | Opcional                   |
| pais                   | String   | Obrigatório                |
| estado                 | String   | Obrigatório                |
| cidade                 | String   | Obrigatório                |
| bairro                 | String   | Obrigatório                |
| rua                    | String   | Obrigatório                |
| numero                 | String   | Obrigatório                |
| complemento            | String?  | Opcional                   |
| pontoReferencia        | String?  | Opcional                   |
| observacoes            | String?  | Opcional                   |
| banco                  | String   | Obrigatório                |
| agencia                | String   | Obrigatório                |
| conta                  | String   | Obrigatório                |
| tipoConta              | String   | Obrigatório                |
| produtos               | String   | Obrigatório                |
| tempoMercado           | String?  | Opcional                   |
| certificacoes          | String?  | Opcional                   |
| capacidadeFornecimento | String?  | Opcional                   |
| atendimento            | String?  | Opcional                   |
| condicoesComerciais    | String?  | Opcional                   |
| historico              | String?  | Opcional                   |
| benchmarking           | String?  | Opcional                   |
| tipoFornecedor         | String   | Obrigatório                |
| prazoMedioEntrega      | Int?     | Opcional                   |
| frequenciaEntrega      | String?  | Opcional                   |
| notaQualidade          | Int?     | Opcional                   |
| notaPontualidade       | Int?     | Opcional                   |
| notaAtendimento        | Int?     | Opcional                   |
| aceitaDevolucao        | Boolean  | Padrão: false              |
| prazoDevolucao         | Int?     | Opcional                   |
| documentos             | Json?    | Opcional                   |
| ocorrencias            | Json?    | Opcional                   |
| ativo                  | Boolean  | Padrão: true               |
| dataCadastro           | DateTime | Padrão: now()              |
| insumos                | Insumo[] | Relação 1:N                |
| comprovantesCompra     | ComprovanteCompra[] | Relação 1:N |

---

### Insumo

| Campo            | Tipo      | Regras                     |
|------------------|-----------|----------------------------|
| id               | Int       | Chave primária, autoincremento |
| nome             | String    | Obrigatório                |
| categoria        | String    | Obrigatório                |
| unidadeMedida    | String    | Obrigatório                |
| quantidadeEstoque| Float     | Padrão: 0                  |
| precoCusto       | Float?    | Opcional                   |
| margemLucro      | Float?    | Opcional                   |
| estoqueMinimo    | Float?    | Opcional                   |
| validade         | DateTime? | Opcional                   |
| ativo            | Boolean   | Padrão: true               |
| criadoEm         | DateTime  | Padrão: now()              |
| fornecedorId     | Int?      | FK para Fornecedor         |
| fornecedor       | Fornecedor? | Relação opcional          |
| entradasEstoque  | EntradaEstoque[] | Relação 1:N          |
| saidas           | SaidaInsumo[]     | Relação 1:N          |
| insumosPizza     | InsumoPizzaPedido[] | Relação N:N        |

---

## EntradaEstoque

| Campo                  | Tipo      | Regras                     |
|------------------------|-----------|----------------------------|
| id                     | Int       | Chave primária, autoincremento |
| insumoId               | Int       | FK para Insumo             |
| centroDeCustoId        | Int       | FK para CentroDeCusto      |
| comprovanteId          | Int?      | FK para ComprovanteCompra  |
| quantidadeEntrada      | Float     | Obrigatório                |
| valorEntrada           | Float     | Obrigatório                |
| dataEntrada            | DateTime  | Obrigatório                |
| notaFiscal             | String?   | Opcional                   |
| validade               | DateTime? | Opcional                   |
| referenciaOperacional  | String?   | Opcional                   |
| divergenciaPreco       | Boolean?  | Opcional                   |
| observacoes            | String?   | Opcional                   |
| lote                   | String?   | Opcional                   |
| ativo                  | Boolean   | Padrão: true               |

---

## SaidaInsumo

| Campo      | Tipo     | Regras                     |
|------------|----------|----------------------------|
| id         | Int      | Chave primária, autoincremento |
| insumoId   | Int      | FK para Insumo             |
| quantidade | Float    | Obrigatório                |
| dataSaida  | DateTime | Obrigatório                |
| ativo      | Boolean  | Padrão: true               |

---

## ComprovanteCompra

| Campo                        | Tipo      | Regras                     |
|------------------------------|-----------|----------------------------|
| id                           | Int       | Chave primária, autoincremento |
| numero                       | String    | Obrigatório                |
| data                         | DateTime  | Obrigatório                |
| valorTotal                   | Float     | Obrigatório                |
| fornecedorId                 | Int       | FK para Fornecedor         |
| notaFiscal                   | String    | Único                      |
| ativo                        | Boolean   | Padrão: true               |
| anexoUrl                     | String?   | Opcional                   |
| integradoComFinanceiro       | Boolean?  | Opcional                   |
| integradoComContabilidade    | Boolean?  | Opcional                   |
| observacoes                  | String?   | Opcional                   |

---

## ItemComprovante

| Campo        | Tipo     | Regras                     |
|--------------|----------|----------------------------|
| id           | Int      | Chave primária, autoincremento |
| comprovanteId| Int      | FK para ComprovanteCompra  |
| nomeInsumo   | String   | Obrigatório                |
| quantidade   | Float    | Obrigatório                |
| valorUnitario| Float    | Obrigatório                |

---

## CentroDeCusto

| Campo            | Tipo      | Regras                     |
|------------------|-----------|----------------------------|
| id               | Int       | Chave primária, autoincremento |
| nome             | String    | Obrigatório                |
| descricao        | String?   | Opcional                   |
| ativo            | Boolean   | Padrão: true               |
| criadoEm         | DateTime  | Padrão: now()              |

---

## Financeiro

| Campo             | Tipo   | Regras                     |
|-------------------|--------|----------------------------|
| id                | Int    | Chave primária, autoincremento |
| orcamentoCompras  | Float  | Padrão: 0                  |

---

## Pizza

| Campo        | Tipo     | Regras                     |
|--------------|----------|----------------------------|
| id           | Int      | Chave primária, autoincremento |
| nome         | String   | Obrigatório                |
| preco        | Float    | Obrigatório                |
| ingredientes | String   | Obrigatório                |
| tamanho      | String   | Obrigatório                |
| tipo         | String   | Padrão: "salgada"          |
| criadaEm     | DateTime | Padrão: now()              |
| ativo        | Boolean  | Padrão: true               |

---

## Pedido

| Campo           | Tipo      | Regras                     |
|-----------------|-----------|----------------------------|
| id              | Int       | Chave primária, autoincremento |
| clienteId       | Int       | FK para Cliente            |
| centroDeCustoId | Int       | FK para CentroDeCusto      |
| formaPagamento  | String    | Obrigatório                |
| observacoes     | String?   | Opcional                   |
| status          | StatusPedido | Enum, padrão: PENDENTE   |
| criadoEm        | DateTime  | Padrão: now()              |

---

## PizzaPedido

| Campo        | Tipo     | Regras                     |
|--------------|----------|----------------------------|
| id           | Int      | Chave primária, autoincremento |
| pedidoId     | Int      | FK para Pedido             |
| pizzaId      | Int      | FK para Pizza              |
| nome         | String   | Obrigatório                |
| precoVenda   | Float    | Obrigatório                |
| quantidade   | Int      | Obrigatório                |

---

## InsumoPizzaPedido

| Campo                | Tipo     | Regras                     |
|----------------------|----------|----------------------------|
| id                   | Int      | Chave primária, autoincremento |
| pizzaPedidoId        | Int      | FK para PizzaPedido        |
| insumoId             | Int      | FK para Insumo             |
| quantidadeUtilizada  | Float    | Obrigatório                |

---

## Bebida

| Campo      | Tipo     | Regras                     |
|------------|----------|----------------------------|
| id         | Int      | Chave primária, autoincremento |
| nome       | String   | Obrigatório                |
| volume     | String   | Obrigatório                |
| tipo       | String   | Obrigatório                |
| embalagem  | String   | Obrigatório                |
| precoFinal | Float    | Obrigatório                |
| ativo      | Boolean  | Padrão: true               |

---

## Campanha

| Campo       | Tipo     | Regras                     |
|-------------|----------|----------------------------|
| id          | Int      | Chave primária, autoincremento |
| nome        | String   | Obrigatório                |
| descricao   | String   | Obrigatório                |
| tipo        | String   | 'desconto', 'combo', 'cupom' |
| valor       | Float    | Obrigatório                |
| percentual  | Float?   | Opcional                   |
| dataInicio  | DateTime | Obrigatório                |
| dataFim     | DateTime | Obrigatório                |
| ativo       | Boolean  | Padrão: true               |

---

## Enum: StatusPedido

| Valor         | Descrição                      |
|---------------|--------------------------------|
| SOLICITADO    | Pedido foi solicitado          |
| PENDENTE      | Aguardando produção            |
| EM_PRODUCAO   | Em preparo                     |
| PRONTO        | Finalizado                     |
| ENTREGUE      | Entregue ao cliente            |
| CANCELADO     | Cancelado                      |
| EXCLUIDO      | Removido do sistema            |

--- 