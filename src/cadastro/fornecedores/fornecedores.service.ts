import { FornecedoresRepository } from "./fornecedores.repository";
import type { CriarFornecedoresDto, AtualizarFornecedoresDto } from "./fornecedores.schema";
import type { Fornecedor } from "./fornecedores.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class FornecedoresService {
  constructor(private readonly repo: FornecedoresRepository = new FornecedoresRepository()) {}

  async listar(): Promise<Fornecedor[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Fornecedor> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Fornecedor não encontrado");
    return item;
  }

  async criar(dados: CriarFornecedoresDto): Promise<Fornecedor> {
    return this.repo.criar(dados);
  }

  async atualizar(id: string, dados: AtualizarFornecedoresDto): Promise<Fornecedor> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados);
  }
}
