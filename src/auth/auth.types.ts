export interface LoginResult {
  token: string;
  usuario: {
    id: string;
    nome: string;
    perfil: "vendedor" | "supervisor" | "estoquista" | "gerente" | "financeiro" | "administrador";
    lojaId: string;
  };
}
