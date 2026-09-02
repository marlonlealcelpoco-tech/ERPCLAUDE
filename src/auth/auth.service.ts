import crypto from "crypto";
import { AuthRepository } from "./auth.repository";
import type { LoginDto } from "./auth.schema";
import type { LoginResult } from "./auth.types";
import { AppError } from "../shared/errors/app-error";
import type { UsuarioAutenticado } from "../shared/auth/require-auth";

const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_assinatura_erp_lasistema_2025";

function signHmac(data: string): string {
  return crypto.createHmac("sha256", JWT_SECRET).update(data).digest("base64url");
}

export function gerarTokenUsuario(usuario: { id: string; nome: string; perfil: any; lojaId: string }): string {
  const payload: UsuarioAutenticado = {
    id: usuario.id,
    nome: usuario.nome,
    perfil: usuario.perfil,
    lojaId: usuario.lojaId,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signHmac(body);
  return `${body}.${signature}`;
}

export function validarTokenUsuario(token: string): UsuarioAutenticado | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [body, signature] = parts;

    const expectedSig = signHmac(body);
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const jsonStr = Buffer.from(body, "base64url").toString("utf-8");
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

    if (!usuario.senhaHash) {
      throw new AppError("Acesso não autorizado para esta conta", 401);
    }

    const hashEsperado = `hash_${dados.senha}`;
    if (usuario.senhaHash !== hashEsperado) {
      throw new AppError("Login ou senha inválidos", 401);
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
