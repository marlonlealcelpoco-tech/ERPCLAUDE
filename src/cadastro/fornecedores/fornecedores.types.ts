export interface Fornecedor {
  id: string;
  nomeRazao: string;
  nomeFantasia?: string;
  cnpjCpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarFornecedorInput {
  nomeRazao: string;
  nomeFantasia?: string;
  cnpjCpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}

export interface AtualizarFornecedorInput {
  nomeRazao?: string;
  nomeFantasia?: string;
  cnpjCpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}
