// Regras de negócio do módulo conciliacao
import { ConciliacaoRepository } from "./conciliacao.repository";
import type { CriarConciliacaoDto, AtualizarConciliacaoDto } from "./conciliacao.schema";
import type { Conciliacao } from "./conciliacao.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class ConciliacaoService {
  constructor(private readonly repo: ConciliacaoRepository = new ConciliacaoRepository()) {}

  async listar(): Promise<Conciliacao[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Conciliacao> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Conciliacao não encontrado");
    return item;
  }

  async criar(dados: CriarConciliacaoDto): Promise<Conciliacao> {
    // TODO: regras de negócio específicas de conciliacao
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarConciliacaoDto): Promise<Conciliacao> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
