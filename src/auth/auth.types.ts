import type { PerfilUsuario } from "../cadastro/usuarios/usuarios.types";

export interface LoginResult {
  token: string;
  usuario: {
    id: string;
    nome: string;
    login: string;
    perfil: PerfilUsuario;
    lojaId: string;
  };
}
