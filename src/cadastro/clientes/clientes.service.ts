import { ClientesRepository } from "./clientes.repository";
import type { CriarClientesDto, AtualizarClientesDto } from "./clientes.schema";
import type { Cliente } from "./clientes.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ClientesService {
  constructor(private readonly repo: ClientesRepository = new ClientesRepository()) {}

  async listar(termo?: string): Promise<Cliente[]> {
    if (termo) {
      return this.repo.buscarPorTermo(termo);
    }
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Cliente> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Cliente não encontrado");
    return item;
  }

  async criar(dados: CriarClientesDto): Promise<Cliente> {
    return this.repo.criar(dados);
  }

  async atualizar(id: string, dados: AtualizarClientesDto): Promise<Cliente> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados);
  }
}
