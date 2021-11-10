export interface ICarga {
  id: string;
  e_cotado: boolean;
  cliente: string;
  origem_carga: string;
  destino_carga: string;
  data_entrega: Date;
  data_coleta: Date;
  tipo_carga: string;
  peso: number;
  solicitante: string;
  canal_comunicacao: string;

  data_cadastro?: Date | null;
  data_atualizacao?: Date | null;
  usuario?: string | null;
}
