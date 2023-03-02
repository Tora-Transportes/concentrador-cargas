import { ICarga } from "../../models/ICargas";

export interface IStatusApp {
  fk_situacao: number;
  usuario: string;
  data_atualizacao: Date;
  placa_veiculo?: string;
  codigo_motorista?: number | null;
  placa_carreta?: string | null;
  placa_bitrem?: string | null;
}

export interface ICargaAppRepository {
  updateFk_situacao(id: number, situacao: IStatusApp): Promise<number>;
  indexId(id: number): Promise<ICarga>;
}
