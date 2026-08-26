import { AuthRepository } from "./auth.repository";
import type { LoginDto } from "./auth.schema";
import type { LoginResult } from "./auth.types";
import { AppError } from "../shared/errors/app-error";

export class AuthService {
  constructor(private readonly repo: AuthRepository = new AuthRepository()) {}

  async login(dados: LoginDto): Promise<LoginResult> {
    const usuario = await this.repo.buscarPorLogin(dados.login);
    if (!usuario) {
      throw new AppError("Login ou senha inválidos", 401);
    }
    // TODO: comparar hash da senha (bcrypt.compare) e gerar token real (JWT)
    throw new AppError("Autenticação ainda não implementada", 501);
  }
}
