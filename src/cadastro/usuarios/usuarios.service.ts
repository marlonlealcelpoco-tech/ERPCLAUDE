// Regras de negócio do módulo usuarios
import { UsuariosRepository } from "./usuarios.repository";
import type { CriarUsuariosDto, AtualizarUsuariosDto } from "./usuarios.schema";
import type { Usuarios } from "./usuarios.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class UsuariosService {
  constructor(private readonly repo: UsuariosRepository = new UsuariosRepository()) {}

  async listar(): Promise<Usuarios[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Usuarios> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Usuarios não encontrado");
    return item;
  }

  async criar(dados: CriarUsuariosDto): Promise<Usuarios> {
    // TODO: regras de negócio específicas de usuarios
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarUsuariosDto): Promise<Usuarios> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
