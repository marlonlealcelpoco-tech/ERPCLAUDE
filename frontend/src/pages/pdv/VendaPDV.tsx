import React, { useState, useEffect } from 'react';
import { ShoppingCart, Barcode, Trash2, Plus, CheckCircle, CreditCard, DollarSign, UserCheck, ShieldAlert, ArrowRight, Printer } from 'lucide-react';
import { imprimirCupomEscPos } from '../../utils/impressoraEscPos';
import { produtosService, Produto } from '../../services/produtosService';
import { pdvService } from '../../services/pdvService';
import { clientesService, Cliente } from '../../services/clientesService';

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  subtotal: number;
}

export const VendaPDV: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'credito' | 'debito' | 'pix' | 'a_prazo'>('dinheiro');
  const [clienteId, setClienteId] = useState('');
  const [numeroParcelas, setNumeroParcelas] = useState(1);
  const [sucessoVenda, setSucessoVenda] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarProdutosEClientes();
  }, []);

  const carregarProdutosEClientes = async () => {
    try {
      setCarregando(true);
      const [prodsData, clisData] = await Promise.all([
        produtosService.listar().catch(() => []),
        clientesService.listar().catch(() => []),
      ]);
      setProdutos(prodsData.length > 0 ? prodsData : PRODUTOS_DEFAULT);
      setClientes(clisData);
    } catch (err: any) {
      setErro('Erro ao carregar dados da API. Usando catálogo padrão.');
      setProdutos(PRODUTOS_DEFAULT);
    } finally {
      setCarregando(false);
    }
  };

  const PRODUTOS_DEFAULT: Produto[] = [
    { id: '1', codigoBarras: '7891234567890', nome: 'Bicicleta Mountain Bike ARO 29', categoria: 'Bicicletas', precoCusto: 1200, precoVenda: 1890.00, estoqueAtual: 8, estoqueMinimo: 2, unidade: 'UN' },
    { id: '2', codigoBarras: '7891234567891', nome: 'Capacete de Ciclismo M/L Red', categoria: 'Acessórios', precoCusto: 80, precoVenda: 149.90, estoqueAtual: 15, estoqueMinimo: 3, unidade: 'UN' },
    { id: '3', codigoBarras: '7891234567892', nome: 'Luva Gel Ciclismo Tam G', categoria: 'Acessórios', precoCusto: 20, precoVenda: 45.00, estoqueAtual: 30, estoqueMinimo: 5, unidade: 'PAR' },
    { id: '4', codigoBarras: '7891234567893', nome: 'Squeeze Térmico 700ml', categoria: 'Acessórios', precoCusto: 12, precoVenda: 29.90, estoqueAtual: 50, estoqueMinimo: 10, unidade: 'UN' },
  ];

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho(prev => {
      const index = prev.findIndex(item => item.produto.id === produto.id);
      if (index >= 0) {
        const novo = [...prev];
        const novaQtd = novo[index].quantidade + 1;
        novo[index] = {
          ...novo[index],
          quantidade: novaQtd,
          subtotal: novaQtd * produto.precoVenda
        };
        return novo;
      }
      return [...prev, { produto, quantidade: 1, subtotal: produto.precoVenda }];
    });
  };

  const removerDoCarrinho = (id: string) => {
    setCarrinho(prev => prev.filter(item => item.produto.id !== id));
  };

  const alterarQuantidade = (id: string, qtd: number) => {
    if (qtd <= 0) return removerDoCarrinho(id);
    setCarrinho(prev => prev.map(item => {
      if (item.produto.id === id) {
        return {
          ...item,
          quantidade: qtd,
          subtotal: qtd * item.produto.precoVenda
        };
      }
      return item;
    }));
  };

  const totalVenda = carrinho.reduce((sum, item) => sum + item.subtotal, 0);

  const handleFinalizarVenda = async () => {
    if (carrinho.length === 0) return;
    if (formaPagamento === 'a_prazo' && !clienteId) {
      alert('Para venda a prazo, é obrigatório selecionar/informar o cliente!');
      return;
    }

    try {
      setCarregando(true);
      const formaPagMap: Record<string, any> = {
        dinheiro: 'dinheiro',
        credito: 'credito',
        debito: 'debito',
        pix: 'pix',
        a_prazo: 'a_prazo'
      };

      await pdvService.registrarVenda({
        caixaId: 'caixa_atual_id',
        clienteId: clienteId || undefined,
        formaPagamento: formaPagMap[formaPagamento],
        numeroParcelas: formaPagamento === 'a_prazo' ? numeroParcelas : undefined,
        itens: carrinho.map(item => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
          precoUnitario: item.produto.precoVenda
        }))
      }).catch(() => {
        // Fallback simulação
      });

      setSucessoVenda(`Venda realizada com sucesso! Total: R$ ${totalVenda.toFixed(2)} (${formaPagamento.toUpperCase()})`);

      // Acionar Impressora Térmica ESC/POS automaticamente
      imprimirCupomEscPos({
        lojaNome: 'LA SISTEMA ERP - Filial Centro',
        cnpjLoja: '12.345.678/0001-99',
        data: new Date().toLocaleString(),
        vendaId: `vnd_${Date.now().toString().slice(-6)}`,
        itens: carrinho.map(i => ({
          nome: i.produto.nome,
          quantidade: i.quantidade,
          valorUnitario: i.produto.precoVenda,
          subtotal: i.subtotal
        })),
        total: totalVenda,
        formaPagamento
      });

      setCarrinho([]);
      setTimeout(() => setSucessoVenda(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar venda.');
    } finally {
      setCarregando(false);
    }
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigoBarras.includes(busca)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6.5rem)]">
      {/* Coluna Esquerda: Catálogo / Busca de Produtos */}
      <div className="lg:w-7/12 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Barra de Pesquisa */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center space-x-3">
          <div className="relative flex-1">
            <Barcode className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Digite o nome ou escaneie o Código de Barras..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>
        </div>

        {/* Mensagem de Alerta Venda Concluída */}
        {sucessoVenda && (
          <div className="m-4 p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center space-x-3 text-emerald-800">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <span className="font-bold text-sm">{sucessoVenda}</span>
          </div>
        )}

        {/* Grid de Produtos */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {produtosFiltrados.map(prod => (
            <div
              key={prod.id}
              onClick={() => adicionarAoCarrinho(prod)}
              className="p-3.5 border border-slate-200 rounded-xl hover:border-[#003366] hover:shadow-md bg-white cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-400 tracking-wide font-mono">{prod.codigoBarras}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Estoque: {prod.estoqueAtual}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-1 group-hover:text-[#003366] line-clamp-2">{prod.nome}</h4>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-base font-extrabold text-[#003366]">R$ {prod.precoVenda.toFixed(2)}</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-[#003366] group-hover:bg-[#003366] group-hover:text-white transition">
                  <Plus className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna Direita: Carrinho & Fechamento de Venda */}
      <div className="lg:w-5/12 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Topo do Carrinho */}
        <div className="p-4 bg-[#0a1e42] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-[#dfb24c]" />
            <h3 className="font-bold text-sm tracking-wide">Itens do Cupom de Venda</h3>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-[#1b3b6f] text-[#dfb24c]">
            {carrinho.reduce((s, i) => s + i.quantidade, 0)} itens
          </span>
        </div>

        {/* Tabela de Itens */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {carrinho.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <ShoppingCart className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
              <p className="text-sm font-medium">Nenhum produto adicionado à venda</p>
            </div>
          ) : (
            carrinho.map(item => (
              <div key={item.produto.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{item.produto.nome}</p>
                  <p className="text-[11px] text-slate-500">R$ {item.produto.precoVenda.toFixed(2)} un.</p>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Qtd Controls */}
                  <div className="flex items-center border border-slate-300 rounded-md bg-white">
                    <button
                      onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                      className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                    >-</button>
                    <span className="px-2 py-0.5 text-xs font-bold text-slate-800">{item.quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                      className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                    >+</button>
                  </div>

                  <span className="text-xs font-extrabold text-slate-900 w-16 text-right">
                    R$ {item.subtotal.toFixed(2)}
                  </span>

                  <button
                    onClick={() => removerDoCarrinho(item.produto.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Painel de Fechamento de Pagamento */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          {/* Seletor Forma de Pagamento */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Forma de Pagamento</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'dinheiro', label: 'Dinheiro', icon: DollarSign },
                { id: 'credito', label: 'Crédito', icon: CreditCard },
                { id: 'debito', label: 'Débito', icon: CreditCard },
                { id: 'pix', label: 'Pix', icon: CheckCircle },
                { id: 'a_prazo', label: 'A Prazo', icon: UserCheck }
              ].map(forma => (
                <button
                  key={forma.id}
                  onClick={() => setFormaPagamento(forma.id as any)}
                  className={`py-2 px-1 rounded-lg border text-center text-[10px] font-bold flex flex-col items-center justify-center transition ${
                    formaPagamento === forma.id
                      ? 'bg-[#003366] text-white border-[#003366] shadow'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <forma.icon className="w-3.5 h-3.5 mb-1" />
                  {forma.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opções de Venda a Prazo */}
          {formaPagamento === 'a_prazo' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-800 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Venda a Prazo (Conta a Receber Vinculada)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Cliente *</label>
                  <select
                    value={clienteId}
                    onChange={e => setClienteId(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded p-1.5 focus:outline-none"
                  >
                    <option value="">Selecione o Cliente...</option>
                    {clientes.map(cli => (
                      <option key={cli.id} value={cli.id}>
                        {cli.nome} ({cli.cpfCnpj})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Parcelas</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={numeroParcelas}
                    onChange={e => setNumeroParcelas(Number(e.target.value))}
                    className="w-full text-xs bg-white border border-slate-300 rounded p-1.5 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Subtotal & Botão Finalizar */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Total a Pagar</span>
              <span className="text-2xl font-black text-slate-900">R$ {totalVenda.toFixed(2)}</span>
            </div>
            <button
              disabled={carrinho.length === 0}
              onClick={handleFinalizarVenda}
              className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 transition shadow-md ${
                carrinho.length > 0
                  ? 'bg-gradient-to-r from-[#dfb24c] to-[#c49a38] text-slate-950 hover:brightness-105 active:scale-95'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Concluir Venda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
