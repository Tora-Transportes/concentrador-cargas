export interface ICarga {
  id: string;
  e_lote: boolean;
  cliente: string;
  origem_carga: string;
  destino_carga: string;
  data_entrega: Date;
  data_coleta: Date;
  tipo_carga: string;
  peso: number;
  responsavel_cadastro: string;
  canal_comunicacao: string;

  observacao?: string | null;
  data_cadastro?: Date | null | string;
  data_atualizacao?: Date | null | string;
  usuario?: string | null;
}
