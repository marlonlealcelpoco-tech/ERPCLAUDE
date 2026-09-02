export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  limiteCredito: number;
  saldoDevedor: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarClienteInput {
  nome: string;
  cpfCnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  limiteCredito?: number;
}

export interface AtualizarClienteInput {
  nome?: string;
  cpfCnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  limiteCredito?: number;
  saldoDevedor?: number;
}
