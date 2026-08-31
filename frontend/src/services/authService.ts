import { api, setAuthToken, removeAuthToken } from './api';
import { PerfilUsuario } from '../types/auth';

export interface LoginPayload {
  username: string;
  senha_hash: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nome: string;
    login: string;
    perfil: PerfilUsuario;
    lojaId: string;
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', {
      login: payload.username,
      senha: payload.senha_hash
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  logout: () => {
    removeAuthToken();
  },
};
