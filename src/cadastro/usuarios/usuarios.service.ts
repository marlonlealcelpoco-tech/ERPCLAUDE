import { UsuariosRepository } from "./usuarios.repository";
import type { CriarUsuariosDto, AtualizarUsuariosDto } from "./usuarios.schema";
import type { Usuario } from "./usuarios.types";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error";

export class UsuariosService {
  constructor(private readonly repo: UsuariosRepository = new UsuariosRepository()) {}

  async listar(): Promise<Usuario[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Usuario> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Usuário não encontrado");
    return item;
  }

  async criar(dados: CriarUsuariosDto): Promise<Usuario> {
    const existente = await this.repo.buscarPorLogin(dados.login);
    if (existente) {
      throw new ConflictError("Já existe um usuário cadastrado com este login");
    }
    return this.repo.criar(dados);
  }

  async atualizar(id: string, dados: AtualizarUsuariosDto): Promise<Usuario> {
    await this.buscarPorId(id);
    if (dados.login) {
      const existente = await this.repo.buscarPorLogin(dados.login);
      if (existente && existente.id !== id) {
        throw new ConflictError("Já existe outro usuário cadastrado com este login");
      }
    }
    return this.repo.atualizar(id, dados);
  }
}
