// Regras de negócio do módulo xml
import { XmlRepository } from "./xml.repository";
import type { CriarXmlDto, AtualizarXmlDto } from "./xml.schema";
import type { Xml } from "./xml.types";
import { NotFoundError } from "../../shared/errors/app-error";

export class XmlService {
  constructor(private readonly repo: XmlRepository = new XmlRepository()) {}

  async listar(): Promise<Xml[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: string): Promise<Xml> {
    const item = await this.repo.buscarPorId(id);
    if (!item) throw new NotFoundError("Xml não encontrado");
    return item;
  }

  async criar(dados: CriarXmlDto): Promise<Xml> {
    // TODO: regras de negócio específicas de xml
    return this.repo.criar(dados as any);
  }

  async atualizar(id: string, dados: AtualizarXmlDto): Promise<Xml> {
    await this.buscarPorId(id);
    return this.repo.atualizar(id, dados as any);
  }
}
