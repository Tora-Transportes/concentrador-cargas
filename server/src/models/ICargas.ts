export interface ICarga {
  id: string;
  e_lote: boolean;
  cliente: string;
  origem_carga: string;
  destino_carga: string;
  data_entrega?: Date | null;
  data_coleta?: Date | null;
  tipo_carga?: string | null;
  quantidade: number;
  quantidade_atual?: number;
  unidade_medida: string;
  responsavel_cadastro: string;
  canal_comunicacao: string;

  local_entrega?: string | null;
  local_coleta?: string | null;
  janela_entrega?: string | null;
  janela_coleta?: string | null;
  informacoes_restritivas?: string | null;
  acessorios_requisitos?: string | null;
  observacao?: string | null;
  data_cadastro?: Date | null | string;
  data_atualizacao?: Date | null | string;
  usuario?: string | null;

  ativo?: number;

  fk_lote_pai?: string;
}
