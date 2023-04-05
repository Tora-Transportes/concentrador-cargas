import database from "../../database";
import { ICarga } from "../../models/ICargas";
import { Knex } from "knex";
export interface IPaginationResult<T> {
  page: number;
  total_pages: number;
  total_registers: number;
  results: T[];
}
export interface IResultExcel<T> {
  results: T[];
}

export class CargaCsnInfoRepository {
  async search(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<IPaginationResult<ICarga>> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    const total = database("con_cargas")
      .count("id as total")
      .leftJoin(
        "con_coordenadas_veiculos",
        "con_cargas.placa_veiculo",
        "con_coordenadas_veiculos.placa"
      )
      .first();
    const results = database("con_cargas")
      .select([
        "con_cargas.*",
        "con_situacoes_cargas_csn.descricao as situacao.descricao",
        "con_situacoes_cargas_csn.cor as situacao.cor",
        "FILIAL.FIL_DSC as filial.descricao",
        "CADASTRO_GERAL.CG_NOME as nome_motorista",
        "con_coordenadas_veiculos.categoria_veiculo",
      ])
      .join(
        "con_situacoes_cargas_csn",
        "con_situacoes_cargas_csn.id",
        "con_cargas.fk_situacao"
      )
      .leftJoin("FILIAL", "FILIAL.FIL_COD", "con_cargas.fk_filial")
      .leftJoin(
        "CADASTRO_GERAL",
        "CADASTRO_GERAL.CG_COD",
        "con_cargas.codigo_motorista"
      )
      .leftJoin(
        "con_coordenadas_veiculos",
        "con_cargas.placa_veiculo",
        "con_coordenadas_veiculos.placa"
      )
      .limit(pageSize)
      .offset((realPage - 1) * pageSize)
      .modify(function (con_cargas) {
        if (query.date_execel_inicio && query.date_execel_fim) {
          con_cargas.andWhereBetween("con_cargas.data_cadastro", [
            new Date(query.date_execel_inicio + "T00:00:00"),
            new Date(query.date_execel_fim + "T00:00:00"),
          ]);
        }
      });

    const isValid = (value: string | null | undefined) =>
      !["", null, undefined, "null", "undefined"].includes(value);

    const filterDbFunction = (qb: Knex.QueryBuilder) => {
      if (query?.data_cadastro) {
        const date = query.data_cadastro.split("T")[0];
        qb.andWhereBetween("data_cadastro", [
          new Date(date + "T00:00:00"),
          new Date(date + "T23:59:59"),
        ]);
      }
      if (query?.fk_filial) {
        qb.andWhere("fk_filial", query.fk_filial);
      }
      if (query?.carga_csn == 1) {
        qb.andWhere("carga_csn", query.carga_csn);
      } else if (query.carga_csn && query.carga_csn != 1) {
        qb.where((qB) => {
          qB.andWhere("carga_csn", "=", 0);
          qB.orWhereNull("carga_csn");
        });
      }

      if (query?.destino_carga) {
        qb.andWhere(
          "destino_carga",
          "like",
          `%${query.destino_carga.toUpperCase()}%`
        );
      }
      if (query?.origem_carga) {
        qb.andWhere(
          "origem_carga",
          "like",
          `%${query.origem_carga.toUpperCase()}%`
        );
      }
      if (query?.data_coleta) {
        qb.andWhere("data_coleta", "=", new Date(query.data_coleta));
      }
      if (query?.data_entrega) {
        qb.andWhere("data_entrega", "=", new Date(query.data_entrega));
      }

      if (isValid(query?.cliente)) {
        qb.andWhere("cliente", "like", `%${query.cliente}%`);
      }
      if (isValid(query?.id)) {
        qb.andWhere("con_cargas.id", "like", `%${query.id}%`);
      }
      if (isValid(String(query?.e_lote))) {
        qb.andWhere("e_lote", "=", `${query.e_lote}`);
      }
      if (isValid(String(query?.tipo_carga))) {
        qb.andWhere("tipo_carga", "like", `%${query.tipo_carga}%`);
      }
      if (isValid(String(query?.documento_transporte))) {
        qb.andWhere(
          "documento_transporte",
          "=",
          `${query.documento_transporte}`
        );
      }
      if (isValid(String(query?.placa_veiculo))) {
        qb.andWhere("placa_veiculo", "like", `%${query.placa_veiculo}%`);
      }
      if (isValid(String(query?.placa_carreta))) {
        qb.andWhere("placa_carreta", "like", `%${query.placa_carreta}%`);
      }
      if (!isNaN(Number(query?.ativo))) {
        qb.whereIn("ativo", [1, 2]);
      }
      if (!isNaN(Number(query?.fk_situacao))) {
        qb.andWhere("fk_situacao", "=", Number(query?.fk_situacao));
      }
      if (isValid(String(query?.responsavel_cadastro))) {
        qb.andWhere(
          "responsavel_cadastro",
          "like",
          `%${query.responsavel_cadastro}%`
        );
      }
      if (query?.categoria_veiculo) {
        qb.andWhere("categoria_veiculo", "=", query.categoria_veiculo);
      }
      if (query?.canal_comunicacao) {
        qb.andWhere("canal_comunicacao", "=", query.canal_comunicacao);
      }
      if (query?.rastreador) {
        if (query.rastreador === "null") {
          qb.andWhere("rastreador", null);
        } else {
          qb.whereNotNull("rastreador").andWhere(
            "rastreador",
            "<>",
            "Sem rastreador"
          );
        }
      }
    };

    total.andWhere(filterDbFunction);

    results.andWhere(filterDbFunction);

    if (isValid(query?.order_column)) {
      results.orderBy(
        "con_cargas." + String(query.order_column),
        String(query?.order_direction)
      );
    }
    results.orderBy("con_cargas.id", "asc");
    //console.log(results.toSQL().toNative());

    const rows: ICarga[] = await results;

    //ESTA LINHA DE CODIGO ABAIXO ESTA SENDO DESENVOLVIDA PARA GANHO NA AUTONOMIA DOS CARREGAMENTOD DOS DADOS
    // const idCarga = rows.map((item) => ` ${item.id}`);
    // const infoPontoParada = await database("con_pontos_parada")
    //   .select([
    //     "con_pontos_parada.*",
    //     "con_rotas_csn.DESCRICAO",
    //     "con_rotas_csn.LATITUDE AS LATITUDE_ROTA",
    //     "con_rotas_csn.LONGITUDE AS LONGITUDE_ROTA",
    //   ])
    //   .whereIn("con_pontos_parada.ID_CON_CARGAS", idCarga)
    //   .leftJoin(
    //     "con_rotas_csn",
    //     "con_rotas_csn.ID",
    //     "con_pontos_parada.ID_ROTAS_CSN"
    //   )
    //   .orderBy("con_pontos_parada.ID", "ASC");

    // rows.forEach((elem) => {
    //   return infoPontoParada.filter((filtroData: IPonto_parada) => {
    //     let allPontoParadaId: IPonto_parada[] = [];
    //     if (elem.id === filtroData.ID_CON_CARGAS) {
    //       allPontoParadaId.push(filtroData);
    //       if (infoPontoParada.length === 3) {
    //         elem.ponto_parada = infoPontoParada;
    //         allPontoParadaId = [];
    //       }
    //     }
    //   });
    // });

    await Promise.all(
      rows.map(async (obj) => {
        obj.ponto_parada = await database("con_pontos_parada")
          .select([
            "con_pontos_parada.*",
            "con_rotas_csn.DESCRICAO",
            "con_rotas_csn.LATITUDE AS LATITUDE_ROTA",
            "con_rotas_csn.LONGITUDE AS LONGITUDE_ROTA",
          ])
          .where("con_pontos_parada.ID_CON_CARGAS", obj.id)
          .leftJoin(
            "con_rotas_csn",
            "con_rotas_csn.ID",
            "con_pontos_parada.ID_ROTAS_CSN"
          )
          .orderBy("con_pontos_parada.ID", "ASC");
        return obj;
      })
    );

    const totalRegisters = Number((await total)?.total) || 0;
    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: rows,
    };
  }

  async searchExcelCsn(
    query: Record<string, any>,
    pageSize = 5
  ): Promise<IResultExcel<ICarga>> {
    const results = database.raw(
      `select * from 
      (select "con_cargas"."id" "Código da carga", "con_cargas"."cliente" "Cliente", 
          CASE WHEN "con_cargas"."e_lote" = 0 THEN 'Não' WHEN "con_cargas"."e_lote" = 1 THEN 'Sim' END AS "E lote", "con_cargas"."origem_carga" "Origem Carga", 
          "con_cargas"."destino_carga" "Destino Carga", to_char("con_cargas"."data_coleta", 'dd/mm/yyyy') AS "Data Coleta", 
          to_char("con_cargas"."data_entrega", 'dd/mm/yyyy') AS "Data Entrega", "con_cargas"."tipo_carga" "Tipo Material", 
          "con_cargas"."unidade_medida" "UN", "con_cargas"."quantidade" "Peso",
          "con_cargas"."quantidade_atual" "Quantidade Atual", "con_cargas"."fk_lote_pai" "Lote Pai", "con_situacoes_cargas_csn"."descricao" "Situação", 
          "FILIAL"."FIL_DSC" "Descrição Filial", "con_cargas"."fk_filial" "Código Filial", "con_cargas"."documento_transporte" "Documento de transporte", 
          "con_cargas"."canal_comunicacao" "Canal Comunicação","con_cargas"."placa_veiculo" "Placa",
          "con_cargas"."placa_carreta" "Placa Carreta", "con_cargas"."rastreador" "Rastreador",
          "con_cargas"."observacao" "Observação","con_cargas"."observacao_gr" "Observação do GR", "con_cargas"."observacao_cancelamento" "Observação Cancelamento",
          CASE WHEN "coordenada_vei"."categoria_veiculo" = 'A' THEN 'Agregado' WHEN "coordenada_vei"."categoria_veiculo" = 'C' THEN 'Carreteiro' 
          WHEN "coordenada_vei"."categoria_veiculo" = 'F' THEN 'Frota Própria' END AS "Categoria Veículo",
          to_char("con_cargas"."data_cadastro", 'dd/mm/yyyy') AS "Data Cadastro", 
          to_char("con_cargas"."data_atualizacao", 'dd/mm/yyyy') AS "Data Atualização",
          to_char("a"."COLETA_EFETIVA_POSTO30", 'dd/mm/yyyy HH24:MI:SS') AS "Coleta Efetiva Posto 30" ,to_char("a"."SAIDA_EFETIVA_COLETA", 'dd/mm/yyyy HH24:MI:SS') AS "Saída Efetiva Posto 30 ",
          to_char("b"."COLETA_EFETIVA_MUNDO", 'dd/mm/yyyy HH24:MI:SS') AS "Coleta Efetiva Mundo",to_char("b"."SAIDA_EFETIVA_COLETA", 'dd/mm/yyyy HH24:MI:SS') AS "Saìda Efetia Mundo",
          to_char("c"."COLETA_EFETIVA_PEACAO", 'dd/mm/yyyy HH24:MI:SS') AS "Coleta Efetiva Peação",to_char("c"."SAIDA_EFETIVA_COLETA", 'dd/mm/yyyy HH24:MI:SS') AS "Saìda Efetia Peação",
          to_char("d"."ENTREGA_EFETIVA", 'dd/mm/yyyy HH24:MI:SS') AS "Entrega Efetiva",to_char("d"."SAIDA_EFETIVA_ENTREGA", 'dd/mm/yyyy HH24:MI:SS') AS "Saìda Efetia Entrega",
          "con_cargas"."responsavel_cadastro" "Responsável Cadastro", "con_cargas"."usuario" "Responsável Alteração"
      from "con_cargas" 
          inner join "con_situacoes_cargas_csn" on "con_situacoes_cargas_csn"."id" = "con_cargas"."fk_situacao" 
          left join "FILIAL" on "FILIAL"."FIL_COD" = "con_cargas"."fk_filial" 
          left join "CADASTRO_GERAL" on "CADASTRO_GERAL"."CG_COD" = "con_cargas"."codigo_motorista" 
          left join "con_pontos_parada" "a" on ("con_cargas"."id" = "a"."ID_CON_CARGAS" and "a"."COLETA_EFETIVA_POSTO30" is not null)
          left join "con_pontos_parada" "b" on ("con_cargas"."id" = "b"."ID_CON_CARGAS" and "b"."COLETA_EFETIVA_MUNDO" is not null)
          left join "con_pontos_parada" "c" on ("con_cargas"."id" = "c"."ID_CON_CARGAS" and "c"."COLETA_EFETIVA_PEACAO" is not null)
          left join "con_pontos_parada" "d" on ("con_cargas"."id" = "d"."ID_CON_CARGAS" and "d"."ENTREGA_EFETIVA" is not null)
          left join "con_coordenadas_veiculos" "coordenada_vei" on ("coordenada_vei"."placa" = "con_cargas"."placa_veiculo")
        where "fk_filial" = ? and "carga_csn" = 1 and "con_cargas"."data_cadastro" BETWEEN ? and ? 
        and "con_cargas"."e_lote" = ? order by "con_cargas"."id" asc) 
      where rownum <= ?`,
      [
        query?.fk_filial,
        new Date(query.date_execel_inicio + "T00:00:00"),
        new Date(query.date_execel_fim + "T23:59:00"),
        query.e_lote,
        pageSize,
      ]
    );

    const rows: ICarga[] = await results;
    return {
      results: rows,
    };
  }

  async index(id: number): Promise<ICarga | undefined> {
    const carga: ICarga[] = await database("con_cargas")
      .select([
        "con_cargas.*",
        "con_situacoes_cargas_csn.descricao as situacao.descricao",
        "con_situacoes_cargas_csn.cor as situacao.cor",
        "FILIAL.FIL_DSC as filial.descricao",
        "CADASTRO_GERAL.CG_NOME as nome_motorista",
      ])
      .where("con_cargas.id", id)
      .join(
        "con_situacoes_cargas_csn",
        "con_situacoes_cargas_csn.id",
        "con_cargas.fk_situacao"
      )
      .leftJoin(
        "CADASTRO_GERAL",
        "CADASTRO_GERAL.CG_COD",
        "con_cargas.codigo_motorista"
      )
      .leftJoin("FILIAL", "FILIAL.FIL_COD", "con_cargas.fk_filial");
    database.raw(
      `CASE WHEN "con_cargas"."e_lote" = 0 THEN 'Não' WHEN "con_cargas"."e_lote" = 1 THEN 'Sim' END AS "E lote"`
    );

    if (!carga) return;

    const locais = (
      await database("con_locais_carga")
        .where("fk_carga", id)
        .select(["descricao"])
    ).map((i) => i.descricao);

    for (const item of carga) {
      const data = await database("con_pontos_parada")
        .select([
          "con_pontos_parada.*",
          "con_rotas_csn.DESCRICAO",
          "con_rotas_csn.LATITUDE AS LATITUDE_ROTA",
          "con_rotas_csn.LONGITUDE AS LONGITUDE_ROTA",
        ])
        .where("con_pontos_parada.ID_CON_CARGAS", item.id)
        .leftJoin(
          "con_rotas_csn",
          "con_rotas_csn.ID",
          "con_pontos_parada.ID_ROTAS_CSN"
        )
        .orderBy("con_pontos_parada.ID", "asc");

      item.ponto_parada = data;
    }

    return { ...carga[0], locais };
  }

  async indexOfSituacaoEndPlaca(
    placa: string
  ): Promise<IResultExcel<ICarga> | undefined> {
    const carga: ICarga[] = await database("con_cargas")
      .select("*")
      .where("con_cargas.placa_veiculo", placa)
      .whereIn("ativo", [1, 2])
      .andWhere("con_cargas.carga_csn", 1)
      .andWhere("con_cargas.e_lote", 0)
      .whereIn("con_cargas.fk_situacao", [2, 3, 7, 8]);

    if (!carga) return;
    return { results: carga };
  }
}
