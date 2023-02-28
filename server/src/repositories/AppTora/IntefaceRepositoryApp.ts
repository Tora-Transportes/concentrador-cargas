import { ICarga } from "../../models/ICargas";

export interface IStatusApp {
  fk_situacao: number;
  codigo_motorista: number | null;
  placa_veiculo: string | null;
  placa_carreta?: string | null;
  placa_bitrem?: string | null;
  data_atualizacao: Date;
  usuario?: string;
}

export interface ICargaAppRepository {
  updateFk_situacao(id: number, situacao: IStatusApp): Promise<number>;
  indexId(id: number): Promise<ICarga>;
}
