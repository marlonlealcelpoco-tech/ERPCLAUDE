// Regras de negócio do módulo fornecedores
import { FornecedoresRepository } from "./fornecedores.repository";
import type { CriarFornecedoresDto, AtualizarFornecedoresDto } from "./fornecedores.schema";
import type { Fornecedores } from "./fornecedores.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class FornecedoresService {
  constructor(private readonly repo: FornecedoresRepository = new FornecedoresRepository()) {}

  async listar(): Promise<Fornecedores[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Fornecedores> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Fornecedores não encontrado");
    return item;
  }

  async criar(dados: CriarFornecedoresDto): Promise<Fornecedores> {
    // TODO: regras de negócio específicas de fornecedores
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarFornecedoresDto): Promise<Fornecedores> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
