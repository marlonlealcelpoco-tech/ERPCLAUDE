export class EscPosService {
  // Comandos ESC/POS padrão
  static ESC = "\x1B";
  static GS = "\x1D";

  static INICIALIZAR = "\x1B\x40"; // ESC @
  static NEGRITO_ON = "\x1B\x45\x01"; // ESC E 1
  static NEGRITO_OFF = "\x1B\x45\x00"; // ESC E 0
  static ALINHAR_ESQUERDA = "\x1B\x61\x00"; // ESC a 0
  static ALINHAR_CENTRO = "\x1B\x61\x01"; // ESC a 1
  static ALINHAR_DIREITA = "\x1B\x61\x02"; // ESC a 2
  static CORTE_PAPEL = "\x1D\x56\x41\x00"; // GS V 65 0 (Corte parcial)

  static gerarCupomVenda(dados: {
    lojaNome: string;
    cnpjLoja: string;
    data: string;
    cupomId: string;
    itens: { nome: string; quantidade: number; valorUnitario: number; subtotal: number }[];
    total: number;
    formaPagamento: string;
  }): string {
    let esc = "";
    esc += this.INICIALIZAR;
    esc += this.ALINHAR_CENTRO + this.NEGRITO_ON + dados.lojaNome + "\n";
    esc += "CNPJ: " + dados.cnpjLoja + "\n";
    esc += "------------------------------------------------\n" + this.NEGRITO_OFF;
    esc += this.ALINHAR_ESQUERDA + `CUPOM DE VENDA: ${dados.cupomId}\nDATA: ${dados.data}\n`;
    esc += "------------------------------------------------\n";
    esc += "QTD  ITEM                            TOTAL(R$)\n";

    for (const item of dados.itens) {
      const q = String(item.quantidade).padEnd(4, " ");
      const n = item.nome.substring(0, 30).padEnd(30, " ");
      const v = item.subtotal.toFixed(2).padStart(10, " ");
      esc += `${q} ${n} ${v}\n`;
    }

    esc += "------------------------------------------------\n";
    esc += this.NEGRITO_ON + this.ALINHAR_DIREITA + `TOTAL A PAGAR: R$ ${dados.total.toFixed(2)}\n`;
    esc += `FORMA PAGAMENTO: ${dados.formaPagamento.toUpperCase()}\n` + this.NEGRITO_OFF;
    esc += "------------------------------------------------\n";
    esc += this.ALINHAR_CENTRO + "Obrigado pela preferencia!\n\n\n\n";
    esc += this.CORTE_PAPEL;

    return esc;
  }
}
