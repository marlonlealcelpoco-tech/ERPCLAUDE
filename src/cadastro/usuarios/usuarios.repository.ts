import { getLocalDb } from "../../shared/database/connection";
import type { Usuario, CriarUsuarioInput, AtualizarUsuarioInput } from "./usuarios.types";
import { enfileirarParaSincronizacao } from "../../shared/database/sync";

const TABLE_NAME = "usuarios";

export class UsuariosRepository {
  async listar(): Promise<Usuario[]> {
    const db = getLocalDb();
    return db.find<Usuario>(TABLE_NAME);
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const db = getLocalDb();
    return db.findById<Usuario>(TABLE_NAME, id);
  }

  async buscarPorLogin(login: string): Promise<Usuario | null> {
    const db = getLocalDb();
    const [usuario] = db.find<Usuario>(TABLE_NAME, (u) => u.login === login);
    return usuario || null;
  }

  async criar(dados: CriarUsuarioInput): Promise<Usuario> {
    const db = getLocalDb();
    const agora = new Date();
    const novoUsuario: Usuario = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nome: dados.nome,
      login: dados.login,
      senhaHash: dados.senha ? `hash_${dados.senha}` : undefined,
      perfil: dados.perfil,
      lojaId: dados.lojaId,
      ativo: dados.ativo ?? true,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    db.insert<Usuario>(TABLE_NAME, novoUsuario);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "insert",
      payload: novoUsuario,
    });

    return novoUsuario;
  }

  async atualizar(id: string, dados: AtualizarUsuarioInput): Promise<Usuario> {
    const db = getLocalDb();
    const { senha, ...resto } = dados;
    const payload: Partial<Usuario> = {
      ...resto,
      ...(senha ? { senhaHash: `hash_${senha}` } : {}),
      atualizadoEm: new Date(),
    };

    const usuarioAtualizado = db.update<Usuario>(TABLE_NAME, id, payload);
    await enfileirarParaSincronizacao({
      tabela: TABLE_NAME,
      operacao: "update",
      payload: usuarioAtualizado,
    });

    return usuarioAtualizado;
  }
}
