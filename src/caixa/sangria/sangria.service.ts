import { SangriaRepository } from "./sangria.repository";
import { AberturaRepository } from "../abertura/abertura.repository";
import type { CriarSangriaDto } from "./sangria.schema";
import type { Sangria } from "./sangria.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class SangriaService {
  constructor(
    private readonly repo: SangriaRepository = new SangriaRepository(),
    private readonly aberturaRepo: AberturaRepository = new AberturaRepository()
  ) {}

  async listar(): Promise<Sangria[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Sangria> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Sangria não encontrada");
    return item;
  }

  async registrarSangria(usuarioId: string, dados: CriarSangriaDto): Promise<Sangria> {
    const caixaAberto = await this.aberturaRepo.buscarCaixaAbertoPorUsuario(usuarioId);
    if (!caixaAberto) {
      throw new NotFoundError("Nenhum caixa aberto para registrar sangria");
    }

    return this.repo.criar({
      caixaId: caixaAberto.id,
      usuarioId,
      valor: dados.valor,
      observacao: dados.observacao,
    });
  }
}
