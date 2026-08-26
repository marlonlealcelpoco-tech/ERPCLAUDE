// Regras de negócio do módulo nfce
import { NfceRepository } from "./nfce.repository";
import type { CriarNfceDto, AtualizarNfceDto } from "./nfce.schema";
import type { Nfce } from "./nfce.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class NfceService {
  constructor(private readonly repo: NfceRepository = new NfceRepository()) {}

  async listar(): Promise<Nfce[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Nfce> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Nfce não encontrado");
    return item;
  }

  async criar(dados: CriarNfceDto): Promise<Nfce> {
    // TODO: regras de negócio específicas de nfce
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarNfceDto): Promise<Nfce> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
