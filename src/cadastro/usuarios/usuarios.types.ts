// Tipos do módulo usuarios conforme desenho-erp.md

export type PerfilUsuario =
  | "vendedor"
  | "supervisor"
  | "estoquista"
  | "gerente"
  | "financeiro"
  | "administrador";

export interface Usuario {
  id: string;
  nome: string;
  login: string;
  senhaHash?: string;
  perfil: PerfilUsuario;
  lojaId: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarUsuarioInput {
  nome: string;
  login: string;
  senha?: string;
  perfil: PerfilUsuario;
  lojaId: string;
  ativo?: boolean;
}

export interface AtualizarUsuarioInput {
  nome?: string;
  login?: string;
  senha?: string;
  perfil?: PerfilUsuario;
  lojaId?: string;
  ativo?: boolean;
}
