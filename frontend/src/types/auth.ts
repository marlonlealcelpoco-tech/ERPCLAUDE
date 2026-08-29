export type PerfilUsuario =
  | 'vendedor'
  | 'supervisor'
  | 'estoquista'
  | 'gerente'
  | 'financeiro'
  | 'administrador';

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  lojaId: string;
  lojaNome: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  perfisPermitidos: PerfilUsuario[];
  children?: MenuItem[];
}
