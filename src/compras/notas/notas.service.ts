import { NotasRepository } from "./notas.repository";
import type { CriarNotasDto } from "./notas.schema";
import type { NotaCompra } from "./notas.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class NotasService {
  constructor(private readonly repo: NotasRepository = new NotasRepository()) {}

  async listar(): Promise<NotaCompra[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<NotaCompra> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Nota de compra não encontrada");
    return item;
  }

  async registrarNota(dados: CriarNotasDto): Promise<NotaCompra> {
    return this.repo.criar({
      ...dados,
      dataEmissao: dados.dataEmissao ? new Date(dados.dataEmissao) : undefined,
    });
  }
}
