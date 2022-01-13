import database from "../database";

export interface IVeiculoRepository {
  search(placa: string): Promise<IVeiculo | undefined>;
  hasDriver(placa: string): Promise<boolean>;
}

export interface IVeiculo {
  id_veiculo: string | number;
  id_tipo_veiculo: string | number;
  descricao: string;
  placa: string;
  ano: string | number;
  chassis: string | null;
  placa_carreta: string | null;
  placa_bitrem: string | null;
  nome_motorista: string | null;
}

export class VeiculoRepository implements IVeiculoRepository {
  async search(placa: string) {
    const query = database("TIPO_VEICULO")
      .select([
        "VEICULO.VEI_COD as id_veiculo",
        "TIPO_VEICULO.TV_COD as id_tipo_veiculo",
        "TIPO_VEICULO.TV_DSC as descricao",
        "VEICULO.VEI_PLACA as placa",
        "VEICULO.VEI_ANO as ano",
        "VEICULO.VEI_CHASSIS as chassis",
        "CARRETA.VEI_PLACA as placa_carreta",
        "BITREM.VEI_PLACA as placa_bitrem",
        "CADASTRO_GERAL.CG_NOME as nome_motorista",
        "CADASTRO_GERAL.CG_COD as codigo_motorista",
      ])
      .join("VEICULO", "VEICULO.TV_COD", "TIPO_VEICULO.TV_COD")
      .leftJoin(
        database("VEICULO").as("CARRETA"),
        "CARRETA.VEI_COD",
        "VEICULO.COD_CARRETA"
      )
      .leftJoin(
        database("VEICULO").as("BITREM"),
        "BITREM.VEI_COD",
        "VEICULO.COD_BITREM"
      )
      .leftJoin("CADASTRO_GERAL", "VEICULO.CG_MOT", "CADASTRO_GERAL.CG_COD")
      .where("VEICULO.VEI_PLACA", placa)
      .first();
    return query;
  }

  async hasDriver(placa: string) {
    return !!(
      (
        await database("VEICULO")
          .count("VEI_PLACA as total")
          .where("VEI_PLACA", placa)
          .join("CADASTRO_GERAL", "VEICULO.CG_MOT", "CADASTRO_GERAL.CG_COD")
          .first()
      )?.total || 0
    );
  }
}
