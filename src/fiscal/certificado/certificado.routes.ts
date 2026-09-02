import { Router } from "express";
import { CertificadoService } from "./certificado.service";
import { salvarCertificadoSchema } from "./certificado.schema";

export const certificadoRouter = Router();
const service = new CertificadoService();

certificadoRouter.post("/certificado", async (req, res, next) => {
  try {
    const validado = salvarCertificadoSchema.parse(req.body);
    const resultado = await service.salvarConfiguracao(validado);
    res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
});

certificadoRouter.get("/certificado/:lojaId", async (req, res, next) => {
  try {
    const config = await service.obterPorLoja(req.params.lojaId);
    if (!config) {
      res.status(404).json({ error: "Certificado A1 não configurado para esta loja" });
      return;
    }
    res.json(config);
  } catch (err) {
    next(err);
  }
});
