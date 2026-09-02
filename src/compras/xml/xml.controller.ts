import type { Request, Response, NextFunction } from "express";
import { XmlService } from "./xml.service";
import { parseXmlSchema } from "./xml.schema";

const service = new XmlService();

export const xmlController = {
  async parsearXml(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = parseXmlSchema.parse(req.body);
      const resultado = await service.parsearXml(dados.conteudoXml);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },
};
