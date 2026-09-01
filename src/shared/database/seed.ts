import { getLocalDb } from "./connection";
import type { Usuario } from "../../cadastro/usuarios/usuarios.types";
import type { Loja } from "../../cadastro/lojas/lojas.types";
import type { Produto } from "../../cadastro/produtos/produtos.types";

export function popularDadosIniciais(): void {
  const db = getLocalDb();

  // 1. Criar Loja Padrão se não existir
  const lojas = db.find<Loja>("lojas");
  if (lojas.length === 0) {
    const lojaPadrao: Loja = {
      id: "loja_1",
      nome: "Filial A - Matriz Centro",
      cnpj: "12345678000199",
      tipo: "matriz",
      endereco: "Rua Principal, 100 - Centro",
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    db.insert("lojas", lojaPadrao);
  }

  // 2. Criar Usuário Admin Padrão (admin / 123456) se não existir
  const usuarios = db.find<Usuario>("usuarios");
  if (!usuarios.some((u) => u.login === "admin")) {
    const adminUser: Usuario = {
      id: "usr_admin",
      nome: "Administrador do Sistema",
      login: "admin",
      senhaHash: "hash_123456",
      perfil: "administrador",
      lojaId: "loja_1",
      ativo: true,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    db.insert("usuarios", adminUser);
  }

  // 3. Criar Produtos Iniciais para Teste no PDV
  const produtos = db.find<Produto>("produtos");
  if (produtos.length === 0) {
    const prodsPadrao: Produto[] = [
      {
        id: "prod_1",
        codigoBarras: "7891234567890",
        nome: "Bicicleta Mountain Bike ARO 29",
        categoria: "Bicicletas",
        precoCusto: 1200,
        precoVenda: 1890,
        estoqueAtual: 10,
        estoqueMinimo: 2,
        unidade: "UN",
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        id: "prod_2",
        codigoBarras: "7891234567891",
        nome: "Capacete de Ciclismo M/L Red",
        categoria: "Acessórios",
        precoCusto: 80,
        precoVenda: 149.9,
        estoqueAtual: 20,
        estoqueMinimo: 3,
        unidade: "UN",
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        id: "prod_3",
        codigoBarras: "7891234567892",
        nome: "Luva Gel Ciclismo Tam G",
        categoria: "Acessórios",
        precoCusto: 20,
        precoVenda: 45,
        estoqueAtual: 30,
        estoqueMinimo: 5,
        unidade: "PAR",
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ];

    for (const p of prodsPadrao) {
      db.insert("produtos", p);
    }
  }

  console.log("[Database Seeder] Dados iniciais populados com sucesso (admin / 123456 pronto para login).");
}
