// Ponto de entrada da aplicação.
// Responsabilidade única deste arquivo: subir o servidor e registrar os módulos.
// Nenhuma regra de negócio deve morar aqui — ela fica dentro de cada módulo.
import express from "express";
import { errorHandler } from "./shared/errors/error-handler";
import { iniciarWorkerSincronizacao } from "./shared/database/sync-worker";
import { popularDadosIniciais } from "./shared/database/seed";

// Cadastros
import { usuariosRouter } from "./cadastro/usuarios/usuarios.routes";
import { clientesRouter } from "./cadastro/clientes/clientes.routes";
import { fornecedoresRouter } from "./cadastro/fornecedores/fornecedores.routes";
import { produtosRouter } from "./cadastro/produtos/produtos.routes";
import { lojasRouter } from "./cadastro/lojas/lojas.routes";

// Compras
import { comprasRouter } from "./compras/compras/compras.routes";
import { notasRouter } from "./compras/notas/notas.routes";
import { xmlRouter } from "./compras/xml/xml.routes";

// Vendas
import { pdvRouter } from "./vendas/pdv/pdv.routes";
import { vendasRouter } from "./vendas/vendas/vendas.routes";
import { devolucoesRouter } from "./vendas/devolucoes/devolucoes.routes";
import { contasAPrazoRouter } from "./vendas/contas-a-prazo/contas-a-prazo.routes";

// Caixa
import { aberturaRouter } from "./caixa/abertura/abertura.routes";
import { movimentosRouter } from "./caixa/movimentos/movimentos.routes";
import { sangriaRouter } from "./caixa/sangria/sangria.routes";
import { recebimentosRouter } from "./caixa/recebimentos/recebimentos.routes";
import { fechamentoRouter } from "./caixa/fechamento/fechamento.routes";

// Estoque
import { entradasRouter } from "./estoque/entradas/entradas.routes";
import { saidasRouter } from "./estoque/saidas/saidas.routes";
import { ajustesRouter } from "./estoque/ajustes/ajustes.routes";
import { avariasRouter } from "./estoque/avarias/avarias.routes";
import { inventarioRouter } from "./estoque/inventario/inventario.routes";

// Financeiro
import { contasPagarRouter } from "./financeiro/contas-pagar/contas-pagar.routes";
import { contasReceberRouter } from "./financeiro/contas-receber/contas-receber.routes";
import { fluxoCaixaRouter } from "./financeiro/fluxo-caixa/fluxo-caixa.routes";
import { dreRouter } from "./financeiro/dre/dre.routes";
import { conciliacaoRouter } from "./financeiro/conciliacao/conciliacao.routes";

// Fiscal
import { nfeRouter } from "./fiscal/nfe/nfe.routes";
import { nfceRouter } from "./fiscal/nfce/nfce.routes";
import { tributacaoRouter } from "./fiscal/tributacao/tributacao.routes";
import { certificadoRouter } from "./fiscal/certificado/certificado.routes";

// Relatórios
import { relatoriosRouter } from "./relatorios/gerais/relatorios.routes";

// Auth
import { authRouter } from "./auth/auth.routes";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRouter);

app.use("/cadastro/usuarios", usuariosRouter);
app.use("/cadastro/clientes", clientesRouter);
app.use("/cadastro/fornecedores", fornecedoresRouter);
app.use("/cadastro/produtos", produtosRouter);
app.use("/cadastro/lojas", lojasRouter);

app.use("/compras/manual", comprasRouter);
app.use("/compras", comprasRouter);
app.use("/compras/notas", notasRouter);
app.use("/compras/xml", xmlRouter);

app.use("/vendas/pdv", pdvRouter);
app.use("/vendas", pdvRouter);
app.use("/vendas/devolucoes", devolucoesRouter);
app.use("/vendas/contas-a-prazo", contasAPrazoRouter);

app.use("/caixa/abertura", aberturaRouter);
app.use("/caixa/movimentos", movimentosRouter);
app.use("/caixa/sangria", sangriaRouter);
app.use("/caixa/recebimentos", recebimentosRouter);
app.use("/caixa/fechamento", fechamentoRouter);

app.use("/estoque/entradas", entradasRouter);
app.use("/estoque/saidas", saidasRouter);
app.use("/estoque/ajustes", ajustesRouter);
app.use("/estoque/avarias", avariasRouter);
app.use("/estoque/inventario", inventarioRouter);
app.use("/estoque/conferencia", inventarioRouter);

app.use("/financeiro/contas-pagar", contasPagarRouter);
app.use("/financeiro/contas-receber", contasReceberRouter);
app.use("/financeiro/fluxo-caixa", fluxoCaixaRouter);
app.use("/financeiro/dre", dreRouter);
app.use("/financeiro/conciliacao", conciliacaoRouter);

app.use("/fiscal/nfe", nfeRouter);
app.use("/fiscal/nfce", nfceRouter);
app.use("/fiscal/tributacao", tributacaoRouter);
app.use("/sefaz", certificadoRouter);

app.use("/relatorios", relatoriosRouter);

// Middleware de erro sempre por último
app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`ERP rodando na porta ${PORT}`);
  popularDadosIniciais();
  iniciarWorkerSincronizacao(5000);
});

export { app };
