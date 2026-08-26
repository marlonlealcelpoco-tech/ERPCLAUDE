import { AuthRepository } from "./auth.repository";
import type { LoginDto } from "./auth.schema";
import type { LoginResult } from "./auth.types";
import { AppError } from "../shared/errors/app-error";
import type { UsuarioAutenticado } from "../shared/auth/require-auth";

export function gerarTokenUsuario(usuario: { id: string; nome: string; perfil: any; lojaId: string }): string {
  const payload: UsuarioAutenticado = {
    id: usuario.id,
    nome: usuario.nome,
    perfil: usuario.perfil,
    lojaId: usuario.lojaId,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function validarTokenUsuario(token: string): UsuarioAutenticado | null {
  try {
    const jsonStr = Buffer.from(token, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as UsuarioAutenticado;
    if (payload && payload.id && payload.perfil && payload.lojaId) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

export class AuthService {
  constructor(private readonly repo: AuthRepository = new AuthRepository()) {}

  async login(dados: LoginDto): Promise<LoginResult> {
    const usuario = await this.repo.buscarPorLogin(dados.login);
    if (!usuario) {
      throw new AppError("Login ou senha inválidos", 401);
    }

    if (usuario.senhaHash) {
      const hashEsperado = `hash_${dados.senha}`;
      if (usuario.senhaHash !== hashEsperado) {
        throw new AppError("Login ou senha inválidos", 401);
      }
    }

    const token = gerarTokenUsuario(usuario);

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login,
        perfil: usuario.perfil,
        lojaId: usuario.lojaId,
      },
    };
  }
}
