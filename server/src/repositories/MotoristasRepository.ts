import database from "../database";

interface IMotoristasRepository {
  findCategoryByCpf(cpf: string): Promise<IResponse>;
}

export interface IMotoristaInfo {
  VEI_PLACA: string;
  NOME_MOTORISTA: string;
  CPF: string;
  CATEGORIA_VEICULO: string;
  SETOR_VEICULO: string;
}

export interface IResponse {
  status: number;
  message: string;
  motoristas: IMotoristaInfo | IMotoristaInfo[] | null;
}

export class MotoristasRepository implements IMotoristasRepository {
  async findCategoryByCpf(cpf: string): Promise<IResponse> {
    const motorista = await database.raw(`
    SELECT 
        VEI.VEI_PLACA,
        CG.CG_NOME AS NOME_MOTORISTA,
        CGI.CGI_NUM AS CPF,
        DECODE(VEI.VEI_CATEGORIA, 'C', 'CARRETEIRO',
                          'A', 'AGREGADO',
                          'F', 'FROTA') AS CATEGORIA_VEICULO,
        STV.SV_DSC AS SETOR_VEICULO
    FROM VEICULO VEI
       LEFT JOIN CADASTRO_GERAL CG ON CG.CG_COD = VEI.CG_MOT AND CG.LOC_COD = VEI.LOC_MOT
       LEFT JOIN CG_IDENTIFICACAO CGI ON CGI.CG_COD = CG.CG_COD AND CGI.LOC_COD = CG.LOC_COD AND CGI.TI_COD = 2
       LEFT JOIN SETOR_VEICULO STV ON STV.SV_COD = VEI.SV_COD
       WHERE CGI.CGI_NUM LIKE '%${cpf}%'   
       AND ROWNUM = 1 
    `);
    if (motorista.length != 0) {
      return {
        status: 200,
        message: "OK",
        motoristas: motorista[0],
      };
    } else {
      return {
        status: 404,
        message: "Motorista não encontrado",
        motoristas: null,
      };
    }
  }
}
