// Regras de negócio do módulo tributacao
import { TributacaoRepository } from "./tributacao.repository";
import type { CriarTributacaoDto, AtualizarTributacaoDto } from "./tributacao.schema";
import type { Tributacao } from "./tributacao.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class TributacaoService {
  constructor(private readonly repo: TributacaoRepository = new TributacaoRepository()) {}

  async listar(): Promise<Tributacao[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Tributacao> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Tributacao não encontrado");
    return item;
  }

  async criar(dados: CriarTributacaoDto): Promise<Tributacao> {
    // TODO: regras de negócio específicas de tributacao
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarTributacaoDto): Promise<Tributacao> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
