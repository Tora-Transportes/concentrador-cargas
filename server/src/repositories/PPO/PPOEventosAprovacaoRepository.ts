import { dateAtualMoment } from "../../Utils/formatData";
import { mssqlPPO } from "../../database";
import AppError from "../../models/AppError";
import IAprovacaoUpdateStatus from "../../models/IAprovacao";
import TokenAd from "../../models/TokenAd";

interface IPPOEventosAprovacaoRepository {
  index(filtro: Record<string, any>): Promise<Promise<any> | undefined>;
  update(
    body: IAprovacaoUpdateStatus,
    oid: string,
    user: string
  ): Promise<Promise<any> | undefined>;
}

export class PPOEventosAprovacaoRepository
  implements IPPOEventosAprovacaoRepository
{
  async index(filtro: Record<string, any>): Promise<Promise<any> | undefined> {
    const query = mssqlPPO("ppo_sascar_eventos_aprovacao")
      .select("*")
      .orderBy("nome", "asc");

    query.whereRaw("?? > ??", ["horas", 24]);

    for (const i in filtro) {
      if (filtro[i] !== undefined && filtro[i] !== null) {
        query.where(i, filtro[i]);
      }
    }
    return await query;
  }

  async update(
    body: IAprovacaoUpdateStatus,
    id: string,
    user: string
  ): Promise<any> {
    const cod_usuario = TokenAd.getClaims(user).name;
    let data;
    if (body.status == 1 || body.status == 3) {
      //supervisor
      data = {
        status_aprovacao: body.status,
        obs_supervisor: body.observacao,
        cod_usu_update: cod_usuario,
        updated_at: new Date(dateAtualMoment()),
      };
    } else {
      //gerente
      if (body.status == 2) {
        //aprovado
        data = {
          status_aprovacao: body.status,
          obs_gerente: body.observacao,
          cod_usu_update: cod_usuario,
          aprovado: 1,
          updated_at: new Date(dateAtualMoment()),
        };
      } else {
        //reprovado
        data = {
          status_aprovacao: body.status,
          obs_gerente: body.observacao,
          cod_usu_update: cod_usuario,
          updated_at: new Date(dateAtualMoment()),
        };
      }
    }
    try {
      await mssqlPPO("dbo.ppo_sascar_eventos_aprovacao")
        .update(data)
        .where({ id: id });
      return { message: "Atualizado com sucesso" };
    } catch (error) {
      throw new AppError("Não foi possivel atualizar o registro", 400);
    }
  }
}
