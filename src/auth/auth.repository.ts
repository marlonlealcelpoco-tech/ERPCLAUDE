// Busca de usuário para autenticação no banco local da filial.
import { getLocalDb } from "../shared/database/connection";

export class AuthRepository {
  async buscarPorLogin(login: string) {
    const db = getLocalDb();
    // TODO: query real na tabela de usuários (senha com hash, ex: bcrypt)
    return null as null | { id: string; nome: string; senhaHash: string; perfil: string; lojaId: string };
  }
}
