-- CreateEnum
CREATE TYPE "public"."StatusPedido" AS ENUM ('SOLICITADO', 'PENDENTE', 'EM_PRODUCAO', 'PRONTO', 'ENTREGUE', 'CANCELADO', 'EXCLUIDO');

-- CreateEnum
CREATE TYPE "public"."StatusEntrega" AS ENUM ('PENDENTE', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA');

-- CreateEnum
CREATE TYPE "public"."StatusPagamento" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."TipoOperacao" AS ENUM ('CRIACAO', 'ATUALIZACAO', 'EXCLUSAO', 'LOGIN', 'LOGOUT', 'LEITURA');

-- CreateEnum
CREATE TYPE "public"."Prioridade" AS ENUM ('baixa', 'media', 'alta');

-- CreateEnum
CREATE TYPE "public"."TipoNotificacao" AS ENUM ('sistema', 'promocional', 'alerta');

-- CreateEnum
CREATE TYPE "public"."TipoIntegracao" AS ENUM ('whatsapp', 'erp');

-- CreateEnum
CREATE TYPE "public"."TipoFinanceiro" AS ENUM ('RECEITA', 'DESPESA');

-- CreateEnum
CREATE TYPE "public"."TipoFidelidade" AS ENUM ('ACUMULADO', 'RESGATE');

-- CreateEnum
CREATE TYPE "public"."TipoCampanha" AS ENUM ('desconto', 'brinde', 'combo');

-- CreateEnum
CREATE TYPE "public"."StatusCotacao" AS ENUM ('PENDENTE', 'RESPONDIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "public"."TipoMovimentacao" AS ENUM ('RECEBIMENTO', 'PAGAMENTO');

-- CreateTable
CREATE TABLE "public"."Auditoria" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" INTEGER NOT NULL,
    "tipoOperacao" "public"."TipoOperacao" NOT NULL,
    "ipOrigem" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" SERIAL NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "telefone" TEXT NOT NULL,
    "telefoneOpcional" TEXT,
    "email" TEXT NOT NULL,
    "observacoes" TEXT,
    "aceitaPromocoes" BOOLEAN NOT NULL,
    "aceitaTermos" BOOLEAN NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enderecoId" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EnderecoEntrega" (
    "id" SERIAL NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "pontoReferencia" TEXT NOT NULL,

    CONSTRAINT "EnderecoEntrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fornecedor" (
    "id" SERIAL NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "contato" TEXT,
    "nacionalidade" TEXT,
    "estadoCivil" TEXT,
    "cpf" TEXT NOT NULL,
    "cnpj" TEXT,
    "rg" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "celular" TEXT,
    "whatsapp" TEXT,
    "telefoneAlternativo" TEXT,
    "pais" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "pontoReferencia" TEXT,
    "observacoes" TEXT,
    "banco" TEXT NOT NULL,
    "agencia" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "tipoConta" TEXT NOT NULL,
    "produtos" TEXT NOT NULL,
    "tempoMercado" TEXT,
    "certificacoes" TEXT,
    "capacidadeFornecimento" TEXT,
    "atendimento" TEXT,
    "condicoesComerciais" TEXT,
    "historico" TEXT,
    "benchmarking" TEXT,
    "tipoFornecedor" TEXT NOT NULL,
    "prazoMedioEntrega" INTEGER,
    "frequenciaEntrega" TEXT,
    "notaQualidade" INTEGER,
    "notaPontualidade" INTEGER,
    "notaAtendimento" INTEGER,
    "aceitaDevolucao" BOOLEAN NOT NULL DEFAULT false,
    "prazoDevolucao" INTEGER,
    "documentos" JSONB,
    "ocorrencias" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Insumo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "quantidadeEstoque" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "precoCusto" DOUBLE PRECISION,
    "precoUnitario" DOUBLE PRECISION NOT NULL,
    "precoFinal" DOUBLE PRECISION,
    "margemLucro" DOUBLE PRECISION,
    "estoqueMinimo" DOUBLE PRECISION,
    "validade" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fornecedorId" INTEGER,

    CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EntradaEstoque" (
    "id" SERIAL NOT NULL,
    "insumoId" INTEGER NOT NULL,
    "centroDeCustoId" INTEGER NOT NULL,
    "comprovanteId" INTEGER,
    "quantidadeEntrada" DOUBLE PRECISION NOT NULL,
    "valorEntrada" DOUBLE PRECISION NOT NULL,
    "dataEntrada" TIMESTAMP(3) NOT NULL,
    "notaFiscal" TEXT,
    "validade" TIMESTAMP(3),
    "referenciaOperacional" TEXT,
    "divergenciaPreco" BOOLEAN,
    "observacoes" TEXT,
    "lote" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EntradaEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SaidaInsumo" (
    "id" SERIAL NOT NULL,
    "insumoId" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "dataSaida" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SaidaInsumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recebimento" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "formaRecebimento" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,

    CONSTRAINT "Recebimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ComprovanteCompra" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "fornecedorId" INTEGER NOT NULL,
    "notaFiscal" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "anexoUrl" TEXT,
    "integradoComFinanceiro" BOOLEAN,
    "integradoComContabilidade" BOOLEAN,
    "observacoes" TEXT,

    CONSTRAINT "ComprovanteCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemComprovante" (
    "id" SERIAL NOT NULL,
    "comprovanteId" INTEGER NOT NULL,
    "nomeInsumo" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemComprovante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CentroDeCusto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CentroDeCusto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Financeiro" (
    "id" SERIAL NOT NULL,
    "tipo" "public"."TipoFinanceiro" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovimentacaoFinanceira" (
    "id" SERIAL NOT NULL,
    "tipo" "public"."TipoMovimentacao" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT,
    "pedidoId" INTEGER,
    "fornecedorId" INTEGER,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MovimentacaoFinanceira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pizza" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "vendas" INTEGER NOT NULL DEFAULT 0,
    "ingredientes" TEXT[],
    "tamanho" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'salgada',
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Pizza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bebida" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "embalagem" TEXT NOT NULL,
    "precoFinal" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Bebida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PizzaPedido" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "pizzaId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "precoVenda" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "PizzaPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pedido" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "centroDeCustoId" INTEGER NOT NULL,
    "formaPagamento" TEXT NOT NULL,
    "observacoes" TEXT,
    "status" "public"."StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorFinal" DOUBLE PRECISION,
    "cupomId" INTEGER,
    "campanhaId" INTEGER,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PedidoItem" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "pizzaId" INTEGER,
    "bebidaId" INTEGER,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pagamento" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "formaPagamento" TEXT NOT NULL,
    "status" "public"."StatusPagamento" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorPago" DOUBLE PRECISION NOT NULL,
    "pagoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comprovante" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "formaPagamento" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Comprovante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InsumoPizzaPedido" (
    "id" SERIAL NOT NULL,
    "pizzaPedidoId" INTEGER NOT NULL,
    "insumoId" INTEGER NOT NULL,
    "quantidadeUtilizada" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InsumoPizzaPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BebidaPedido" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "bebidaId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "embalagem" TEXT NOT NULL,
    "precoFinal" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "BebidaPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chamado" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "prioridade" "public"."Prioridade" NOT NULL DEFAULT 'media',
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "resposta" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chamado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Suporte" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "prioridade" "public"."Prioridade" NOT NULL DEFAULT 'media',
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Configuracao" (
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "margemLucro" DOUBLE PRECISION,
    "horarioAbertura" TEXT,
    "horarioFechamento" TEXT,
    "taxaEntrega" DOUBLE PRECISION,
    "tempoEstimadoEntrega" INTEGER,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "public"."Notificacao" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" "public"."TipoNotificacao" NOT NULL,
    "destino" TEXT,
    "agendadaPara" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "destinatarioId" INTEGER NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Integracao" (
    "id" SERIAL NOT NULL,
    "tipo" "public"."TipoIntegracao" NOT NULL,
    "destino" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Integracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fidelidade" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "pontos" INTEGER NOT NULL,
    "tipo" "public"."TipoFidelidade" NOT NULL,
    "recompensaId" INTEGER,
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Fidelidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recompensa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valorMinimo" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Recompensa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entrega" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "entregadorId" INTEGER NOT NULL,
    "endereco" TEXT NOT NULL,
    "observacoes" TEXT,
    "status" "public"."StatusEntrega" NOT NULL DEFAULT 'PENDENTE',
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entregador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Entregador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cotacao" (
    "id" SERIAL NOT NULL,
    "fornecedorId" INTEGER NOT NULL,
    "prazoEntrega" TEXT,
    "status" "public"."StatusCotacao" NOT NULL DEFAULT 'PENDENTE',
    "dataSolicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataResposta" TIMESTAMP(3),
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "valorFinal" DOUBLE PRECISION,

    CONSTRAINT "Cotacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemCotacao" (
    "id" SERIAL NOT NULL,
    "cotacaoId" INTEGER NOT NULL,
    "insumoId" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "preco" DOUBLE PRECISION,

    CONSTRAINT "ItemCotacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cupom" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "desconto" DOUBLE PRECISION NOT NULL,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cupom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campanha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "percentual" DOUBLE PRECISION,
    "valor" DOUBLE PRECISION,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Marketing" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Marketing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Avaliacao" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "public"."Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "public"."Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_enderecoId_key" ON "public"."Cliente"("enderecoId");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cpf_key" ON "public"."Fornecedor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "public"."Fornecedor"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_rg_key" ON "public"."Fornecedor"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_email_key" ON "public"."Fornecedor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ComprovanteCompra_notaFiscal_key" ON "public"."ComprovanteCompra"("notaFiscal");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_nome_key" ON "public"."Produto"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_pedidoId_key" ON "public"."Entrega"("pedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cupom_codigo_key" ON "public"."Cupom"("codigo");

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "public"."EnderecoEntrega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Insumo" ADD CONSTRAINT "Insumo_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "public"."Fornecedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntradaEstoque" ADD CONSTRAINT "EntradaEstoque_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntradaEstoque" ADD CONSTRAINT "EntradaEstoque_centroDeCustoId_fkey" FOREIGN KEY ("centroDeCustoId") REFERENCES "public"."CentroDeCusto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntradaEstoque" ADD CONSTRAINT "EntradaEstoque_comprovanteId_fkey" FOREIGN KEY ("comprovanteId") REFERENCES "public"."ComprovanteCompra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaidaInsumo" ADD CONSTRAINT "SaidaInsumo_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recebimento" ADD CONSTRAINT "Recebimento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComprovanteCompra" ADD CONSTRAINT "ComprovanteCompra_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "public"."Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemComprovante" ADD CONSTRAINT "ItemComprovante_comprovanteId_fkey" FOREIGN KEY ("comprovanteId") REFERENCES "public"."ComprovanteCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimentacaoFinanceira" ADD CONSTRAINT "MovimentacaoFinanceira_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimentacaoFinanceira" ADD CONSTRAINT "MovimentacaoFinanceira_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "public"."Fornecedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PizzaPedido" ADD CONSTRAINT "PizzaPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PizzaPedido" ADD CONSTRAINT "PizzaPedido_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "public"."Pizza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_centroDeCustoId_fkey" FOREIGN KEY ("centroDeCustoId") REFERENCES "public"."CentroDeCusto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_cupomId_fkey" FOREIGN KEY ("cupomId") REFERENCES "public"."Cupom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "public"."Campanha"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoItem" ADD CONSTRAINT "PedidoItem_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "public"."Pizza"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoItem" ADD CONSTRAINT "PedidoItem_bebidaId_fkey" FOREIGN KEY ("bebidaId") REFERENCES "public"."Bebida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pagamento" ADD CONSTRAINT "Pagamento_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comprovante" ADD CONSTRAINT "Comprovante_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InsumoPizzaPedido" ADD CONSTRAINT "InsumoPizzaPedido_pizzaPedidoId_fkey" FOREIGN KEY ("pizzaPedidoId") REFERENCES "public"."PizzaPedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InsumoPizzaPedido" ADD CONSTRAINT "InsumoPizzaPedido_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BebidaPedido" ADD CONSTRAINT "BebidaPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BebidaPedido" ADD CONSTRAINT "BebidaPedido_bebidaId_fkey" FOREIGN KEY ("bebidaId") REFERENCES "public"."Bebida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chamado" ADD CONSTRAINT "Chamado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Suporte" ADD CONSTRAINT "Suporte_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Suporte" ADD CONSTRAINT "Suporte_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fidelidade" ADD CONSTRAINT "Fidelidade_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fidelidade" ADD CONSTRAINT "Fidelidade_recompensaId_fkey" FOREIGN KEY ("recompensaId") REFERENCES "public"."Recompensa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrega" ADD CONSTRAINT "Entrega_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrega" ADD CONSTRAINT "Entrega_entregadorId_fkey" FOREIGN KEY ("entregadorId") REFERENCES "public"."Entregador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cotacao" ADD CONSTRAINT "Cotacao_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "public"."Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemCotacao" ADD CONSTRAINT "ItemCotacao_cotacaoId_fkey" FOREIGN KEY ("cotacaoId") REFERENCES "public"."Cotacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemCotacao" ADD CONSTRAINT "ItemCotacao_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "public"."Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avaliacao" ADD CONSTRAINT "Avaliacao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
