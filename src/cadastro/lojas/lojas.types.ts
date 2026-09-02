export interface Loja {
  id: string;
  nome: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
  matriz: boolean;
  ativa: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarLojaInput {
  nome: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
  matriz?: boolean;
  ativa?: boolean;
}

export interface AtualizarLojaInput {
  nome?: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
  matriz?: boolean;
  ativa?: boolean;
}
