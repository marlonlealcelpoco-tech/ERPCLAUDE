import { TributacaoRepository } from "./tributacao.repository";
import type { CriarTributacaoDto, AtualizarTributacaoDto } from "./tributacao.schema";
import type { RegraTributaria } from "./tributacao.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class TributacaoService {
  constructor(private readonly repo: TributacaoRepository = new TributacaoRepository()) {}

  async listar(): Promise<RegraTributaria[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<RegraTributaria> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Regra tributária não encontrada");
    return item;
  }

  async buscarPorNcm(ncm: string): Promise<RegraTributaria | null> {
    return this.repo.buscarPorNcm(ncm);
  }

  async criar(dados: CriarTributacaoDto): Promise<RegraTributaria> {
    return this.repo.criar(dados);
  }

  async atualizar(id: string, dados: AtualizarTributacaoDto): Promise<RegraTributaria> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados);
  }
}
