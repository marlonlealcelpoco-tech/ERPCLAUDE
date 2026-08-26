// Regras de negócio do módulo fechamento
import { FechamentoRepository } from "./fechamento.repository";
import type { CriarFechamentoDto, AtualizarFechamentoDto } from "./fechamento.schema";
import type { Fechamento } from "./fechamento.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class FechamentoService {
  constructor(private readonly repo: FechamentoRepository = new FechamentoRepository()) {}

  async listar(): Promise<Fechamento[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Fechamento> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Fechamento não encontrado");
    return item;
  }

  async criar(dados: CriarFechamentoDto): Promise<Fechamento> {
    // TODO: regras de negócio específicas de fechamento
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarFechamentoDto): Promise<Fechamento> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
