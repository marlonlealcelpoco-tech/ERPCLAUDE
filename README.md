# # ERP Claude

Sistema ERP sob medida (PDV, estoque, financeiro, cadastros), multi-loja, preparado para emissão fiscal (NFC-e) no futuro.

O desenho completo do sistema está em [`desenho-erp.md`](./desenho-erp.md).

## Arquitetura de pastas

O código é organizado **por funcionalidade**, não por camada técnica. Cada módulo folha (ex: `vendas/pdv`) tem seus próprios arquivos pequenos:

```
modulo/
├── modulo.routes.ts       # rotas HTTP
├── modulo.controller.ts   # entrada/saída HTTP, chama o service
├── modulo.service.ts      # regras de negócio
├── modulo.repository.ts   # acesso ao banco (local da filial)
├── modulo.schema.ts       # validação de entrada (zod)
└── modulo.types.ts        # tipos TypeScript
```

Isso significa que `server.ts` só sobe o servidor e registra os módulos — nenhuma regra de negócio mora nele. Para alterar, por exemplo, devoluções, você mexe só em `src/vendas/devolucoes/`, sem tocar no resto do sistema.

```
src/
├── auth/                    # login/autenticação
├── cadastro/                # usuarios, clientes, fornecedores, produtos, lojas
├── compras/                 # compras, notas, importação de xml
├── vendas/                  # pdv, vendas, devolucoes, contas-a-prazo
├── caixa/                   # abertura, movimentos, sangria, recebimentos, fechamento
├── estoque/                 # entradas, saidas, ajustes, avarias, inventario
├── financeiro/              # contas-pagar, contas-receber, fluxo-caixa, dre, conciliacao
├── fiscal/                  # nfe, nfce, tributacao (estrutura pronta p/ o futuro)
├── relatorios/              # relatórios gerais multi-loja
├── shared/                  # database (local + central + sync), errors, auth, audit, utils
└── server.ts                # apenas inicia o servidor e registra as rotas
```

## Estado atual

Este é o **scaffold inicial**: toda a estrutura de pastas e arquivos está criada, com contratos (tipos, schemas, assinaturas de métodos) definidos, mas a maior parte das implementações está marcada com `TODO`. A ideia é preencher módulo por módulo, seguindo o roadmap abaixo, sem nunca precisar mexer em arquivos gigantes ou módulos não relacionados.

## Roadmap (do desenho-erp.md)

1. Banco de dados + cadastros (cliente, produto, fornecedor, usuário, loja)
2. Login e permissões por perfil
3. PDV: abertura/fechamento de caixa, venda à vista e a prazo
4. Estoque (entrada/saída automática)
5. Financeiro (contas a receber/pagar integradas)
6. Importação de XML de compra
7. Relatórios (fechamento de caixa em PDF + relatórios gerais por período)
8. Preparação para NFC-e (estrutura pronta, integração futura)

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` — sobe o servidor em modo watch
- `npm run build` — compila para `dist/`
- `npm run typecheck` — checa tipos sem gerar arquivos
