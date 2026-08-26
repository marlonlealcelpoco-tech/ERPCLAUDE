// Regras de negócio do módulo clientes
import { ClientesRepository } from "./clientes.repository";
import type { CriarClientesDto, AtualizarClientesDto } from "./clientes.schema";
import type { Clientes } from "./clientes.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ClientesService {
  constructor(private readonly repo: ClientesRepository = new ClientesRepository()) {}

  async listar(): Promise<Clientes[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Clientes> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Clientes não encontrado");
    return item;
  }

  async criar(dados: CriarClientesDto): Promise<Clientes> {
    // TODO: regras de negócio específicas de clientes
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarClientesDto): Promise<Clientes> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
