import { AberturaRepository } from "./abertura.repository";
import type { CriarAberturaDto } from "./abertura.schema";
import type { CaixaAbertura } from "./abertura.types";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error";

export class AberturaService {
  constructor(private readonly repo: AberturaRepository = new AberturaRepository()) {}

  async listar(): Promise<CaixaAbertura[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<CaixaAbertura> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Caixa não encontrado");
    return item;
  }

  async buscarCaixaAberto(usuarioId: string): Promise<CaixaAbertura> {
    const item = await this.repo.buscarCaixaAbertoPorUsuario(usuarioId);
    if (!item) throw new NotFoundError("Nenhum caixa aberto para este usuário");
    return item;
  }

  async abrirCaixa(usuarioId: string, lojaId: string, dados: CriarAberturaDto): Promise<CaixaAbertura> {
    const caixaAberto = await this.repo.buscarCaixaAbertoPorUsuario(usuarioId);
    if (caixaAberto) {
      throw new ConflictError("Já existe um caixa aberto para este usuário");
    }
    return this.repo.criar({
      usuarioId,
      lojaId,
      valorInicial: dados.valorInicial,
    });
  }
}
