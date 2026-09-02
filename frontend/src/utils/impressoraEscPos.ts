export interface CupomVendaData {
  lojaNome: string;
  cnpjLoja: string;
  data: string;
  vendaId: string;
  itens: { nome: string; quantidade: number; valorUnitario: number; subtotal: number }[];
  total: number;
  formaPagamento: string;
}

export function imprimirCupomEscPos(dados: CupomVendaData): void {
  const janela = window.open('', '_blank', 'width=400,height=600');
  if (!janela) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cupom Térmico ESC/POS - ${dados.vendaId}</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 300px;
            margin: 0 auto;
            padding: 10px;
            font-size: 12px;
            color: #000;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          .line { border-bottom: 1px dashed #000; margin: 6px 0; }
          .item-row { display: flex; justify-content: space-between; margin: 2px 0; }
        </style>
      </head>
      <body>
        <div class="text-center bold" style="font-size: 14px;">${dados.lojaNome}</div>
        <div class="text-center">CNPJ: ${dados.cnpjLoja}</div>
        <div class="line"></div>
        <div>CUPOM DE VENDA: <span class="bold">${dados.vendaId}</span></div>
        <div>DATA: ${dados.data}</div>
        <div class="line"></div>
        <div class="bold item-row">
          <span>QTD ITEM</span>
          <span>SUBTOTAL</span>
        </div>
        ${dados.itens.map(i => `
          <div class="item-row">
            <span>${i.quantidade}x ${i.nome.substring(0, 18)}</span>
            <span>R$ ${i.subtotal.toFixed(2)}</span>
          </div>
        `).join('')}
        <div class="line"></div>
        <div class="text-right bold" style="font-size: 14px;">TOTAL: R$ ${dados.total.toFixed(2)}</div>
        <div class="text-right">PAGAMENTO: ${dados.formaPagamento.toUpperCase()}</div>
        <div class="line"></div>
        <div class="text-center bold" style="margin-top: 15px;">IMPRESSORA TÉRMICA ESC/POS</div>
        <div class="text-center" style="font-size: 10px;">Bematech / Daruma / Epson / Elgin</div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  janela.document.write(html);
  janela.document.close();
}
