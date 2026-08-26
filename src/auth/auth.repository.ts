import { getLocalDb } from "../shared/database/connection";
import type { Usuario } from "../cadastro/usuarios/usuarios.types";

const TABLE_NAME = "usuarios";

export class AuthRepository {
  async buscarPorLogin(login: string): Promise<Usuario | null> {
    const db = getLocalDb();
    const [usuario] = db.find<Usuario>(TABLE_NAME, (u) => u.login === login && u.ativo);
    return usuario || null;
  }
}
