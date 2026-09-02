export interface RegraTributaria {
  id: string;
  descricao: string;
  ncm: string;
  cstIcms: string;
  cfop: string;
  aliquotaIcms: number;
  aliquotaPis: number;
  aliquotaCofins: number;
  ativa: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarTributacaoInput {
  descricao: string;
  ncm: string;
  cstIcms: string;
  cfop: string;
  aliquotaIcms: number;
  aliquotaPis?: number;
  aliquotaCofins?: number;
  ativa?: boolean;
}

export interface AtualizarTributacaoInput {
  descricao?: string;
  ncm?: string;
  cstIcms?: string;
  cfop?: string;
  aliquotaIcms?: number;
  aliquotaPis?: number;
  aliquotaCofins?: number;
  ativa?: boolean;
}
