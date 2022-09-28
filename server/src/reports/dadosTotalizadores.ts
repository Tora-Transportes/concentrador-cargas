import database from "../database";
import xlsx from "xlsx";

export interface IFilter {
  data_inicio?: string;
  data_final?: string;
  fk_filial?: string | null;
}

export class ReportDetalhesTotalizadores {
  factory(key: string) {
    if (key === "portal") {
      return database("con_cargas")
        .where("canal_comunicacao", "portal")
        .where("e_lote", 0)
        .where("ativo", 1);
    }
    if (key === "manual") {
      return database("con_cargas")
        .where("canal_comunicacao", "manual")
        .where("e_lote", 0)
        .where("ativo", 1);
    }
    if (key === "ativas") {
      return database("con_cargas").where("e_lote", 0).where("ativo", 1);
    }
    if (key === "desativadas") {
      return database("con_cargas").where("e_lote", 0).where("ativo", 0);
    }

    if (key === "lotes_ativos") {
      return database("con_cargas").where("e_lote", 1).where("ativo", 1);
    }
    if (key === "lotes_desativados") {
      return database("con_cargas").where("e_lote", 1).where("ativo", 0);
    }
    if (key === "completo") {
      return database("con_cargas").where("e_lote", 0);
    }

    if (key === "email") {
      return database("con_cargas")
        .where("e_lote", 0)
        .where("ativo", 1)
        .where("canal_comunicacao", "email");
    }

    throw new Error("Invalid key");
  }

  async generate(
    key: string,
    { data_inicio, data_final, fk_filial }: IFilter,
    filename: string
  ) {
    const query = this.factory(key)
      .select([
        "con_cargas.id AS Código da carga",
        "con_cargas.cliente AS Cliente",
        database.raw(
          `CASE WHEN "con_cargas"."e_lote" = 0 THEN 'Não' WHEN "con_cargas"."e_lote" = 1 THEN 'Sim' END AS "E lote"`
        ),
        "con_cargas.origem_carga AS Origem Carga",
        "con_cargas.destino_carga AS Destino Carga",
        database.raw(
          `to_char("con_cargas"."data_entrega", 'dd/mm/yyyy') AS "Data Entrega"`
        ),
        database.raw(
          `to_char("con_cargas"."data_coleta", 'dd/mm/yyyy') AS "Data Coleta"`
        ),
        "con_cargas.tipo_carga AS Tipo Material",
        "con_cargas.quantidade AS Quantidade",
        "con_cargas.quantidade_atual AS Quantidade Atual",
        "con_cargas.fk_lote_pai AS Lote Pai",
        "con_situacoes_cargas.descricao AS Situação",
        "con_cargas.unidade_medida AS UN",
        "con_cargas.responsavel_cadastro AS Responsável Cadastro",
        "con_cargas.canal_comunicacao AS Canal AS Comunicação",
        "con_cargas.observacao AS Observação",
        "con_situacoes_cargas.descricao AS Status",
        "con_situacoes_cargas.descricao AS Descrição Filial",
        "con_cargas.fk_filial AS Código Filial",
        "con_cargas.documento_transporte AS Documento de transporte",
        "con_cargas.placa_veiculo AS Placa",
        "con_cargas.placa_carreta AS Placa Carreta",
        "con_cargas.placa_veiculo AS Placa Bitrem",
        "con_cargas.codigo_motorista AS Código motorista",
        "CADASTRO_GERAL.CG_NOME as Nome motorista",
        "con_cargas.observacao_gr AS Observação do GR",
        database.raw(
          `to_char("con_cargas"."data_cadastro", 'dd/mm/yyyy') AS "Data Cadastro"`
        ),
        database.raw(
          `to_char("con_cargas"."data_atualizacao", 'dd/mm/yyyy') AS "Data Atualização"`
        ),
        database.raw(
          `CASE WHEN "con_cargas"."ativo" = 0 THEN 'DESATIVADO' WHEN "con_cargas"."ativo" = 1 THEN 'ATIVO' END AS "Ativo"`
        ),
        "observacao_exclusao AS Observação Exclusão",
        "observacao_cancelamento AS Observação Cancelamento",
      ])
      .join(
        "con_situacoes_cargas",
        "con_situacoes_cargas.id",
        "con_cargas.fk_situacao"
      )
      .leftJoin(
        "CADASTRO_GERAL",
        "CADASTRO_GERAL.CG_COD",
        "con_cargas.codigo_motorista"
      )
      .leftJoin("FILIAL", "FILIAL.FIL_COD", "con_cargas.fk_filial");
    if (data_inicio) {
      query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') >= ?`, [
        data_inicio,
      ]);
    }
    if (data_final) {
      query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') <= ?`, [
        data_final,
      ]);
    }
    if (fk_filial) {
      query.where("fk_filial", fk_filial);
    }

    const searchResult = await query;

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(searchResult);

    xlsx.utils.book_append_sheet(workbook, sheet);

    xlsx.writeFile(workbook, filename, {
      bookType: "xlsx",
      type: "binary",
    });
  }

  // async generate(
  //   key: string,
  //   { data_inicio, data_final, fk_filial }: IFilter,
  //   filename: string
  // ) {
  //   const query = this.factory(key)
  //     .select([
  //       "con_cargas.*",
  //       "con_situacoes_cargas.descricao as situacao.descricao",
  //       "con_situacoes_cargas.cor as situacao.cor",
  //       "FILIAL.FIL_DSC as filial.descricao",
  //       "CADASTRO_GERAL.CG_NOME as nome_motorista",
  //     ])
  //     .join(
  //       "con_situacoes_cargas",
  //       "con_situacoes_cargas.id",
  //       "con_cargas.fk_situacao"
  //     )
  //     .leftJoin(
  //       "CADASTRO_GERAL",
  //       "CADASTRO_GERAL.CG_COD",
  //       "con_cargas.codigo_motorista"
  //     )
  //     .leftJoin("FILIAL", "FILIAL.FIL_COD", "con_cargas.fk_filial");
  //   if (data_inicio) {
  //     query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') >= ?`, [
  //       data_inicio,
  //     ]);
  //   }
  //   if (data_final) {
  //     query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') <= ?`, [
  //       data_final,
  //     ]);
  //   }
  //   if (fk_filial) {
  //     query.where("fk_filial", fk_filial);
  //   }

  //   const columns = [
  //     { name: "id", description: "Código da carga", type: "string" },
  //     { name: "cliente", description: "Cliente", type: "string" },
  //     { name: "e_lote", description: "E Lote ?", type: "bool" },
  //     { name: "origem_carga", description: "Origem Carga", type: "string" },
  //     { name: "destino_carga", description: "Destino Carga", type: "string" },
  //     { name: "data_entrega", description: "Data Entrega", type: "date" },
  //     { name: "data_coleta", description: "Data Coleta", type: "date" },
  //     { name: "tipo_carga", description: "Tipo Material", type: "string" },
  //     { name: "quantidade", description: "Quantidade", type: "number" },
  //     {
  //       name: "quantidade_atual",
  //       description: "Quantidade Atual",
  //       type: "number",
  //     },
  //     {
  //       name: "fk_lote_pai",
  //       description: "Lote Pai",
  //       type: "string",
  //     },
  //     {
  //       name: "situacao.descricao",
  //       description: "Situação",
  //       type: "string",
  //     },
  //     { name: "unidade_medida", description: "UN", type: "string" },
  //     {
  //       name: "responsavel_cadastro",
  //       description: "Responsável Cadastro",
  //       type: "string",
  //     },
  //     {
  //       name: "canal_comunicacao",
  //       description: "Canal Comunicação",
  //       type: "string",
  //     },
  //     { name: "observacao", description: "Observação", type: "string" },
  //     { name: "situacao.descricao", description: "Status", type: "string" },
  //     {
  //       name: "filial.descricao",
  //       description: "Descrição Filial",
  //       type: "string",
  //     },
  //     { name: "fk_filial", description: "Código Filial", type: "number" },
  //     {
  //       name: "documento_transporte",
  //       description: "Documento de transporte",
  //       type: "string",
  //     },
  //     { name: "placa_veiculo", description: "Placa Cavalo", type: "string" },
  //     { name: "placa_carreta", description: "Placa Carreta", type: "string" },
  //     { name: "placa_veiculo", description: "Placa Bitrem", type: "string" },
  //     {
  //       name: "codigo_motorista",
  //       description: "Código motorista",
  //       type: "string",
  //     },
  //     { name: "nome_motorista", description: "Nome motorista", type: "string" },
  //     {
  //       name: "observacao_gr",
  //       description: "Observação do GR",
  //       type: "string",
  //     },
  //     { name: "data_cadastro", description: "Data Cadastro", type: "date" },
  //     {
  //       name: "data_atualizacao",
  //       description: "Data Atualização",
  //       type: "date",
  //     },
  //     { name: "ativo", description: "Ativo", type: "string" },
  //     {
  //       name: "observacao_exclusao",
  //       description: "Observação Exclusão",
  //       type: "string",
  //     },
  //     {
  //       name: "observacao_cancelamento",
  //       description: "Observação Cancelamento",
  //       type: "string",
  //     },
  //   ];

  //   const searchResult = await query;

  //   const workbook = xlsx.utils.book_new();
  //   const sheet = xlsx.utils.json_to_sheet(
  //     searchResult.map((carga: Record<string, any>) => {
  //       const tmp: Record<string, any> = {};
  //       for (const i of columns) {
  //         const titulo = i.description;
  //         if (titulo) {
  //           tmp[titulo] = carga[i.name];
  //           if (i.name === "e_lote") {
  //             tmp[titulo] = carga[i.name] ? "SIM" : "NÃO";
  //           }
  //           if (i.name === "ativo") {
  //             tmp[titulo] = +carga[i.name] === 1 ? "ATIVO" : "DESATIVADO";
  //           }
  //           if (["data_coleta", "data_entrega"].includes(i.name)) {
  //             tmp[titulo] = carga[i.name]
  //               ?.toISOString()
  //               ?.split("T")[0]
  //               ?.split("-")
  //               .reverse()
  //               .join("/");
  //           }
  //         }
  //       }
  //       return tmp;
  //     })
  //   );

  //   xlsx.utils.book_append_sheet(workbook, sheet);

  //   xlsx.writeFile(workbook, filename, {
  //     bookType: "xlsx",
  //     type: "binary",
  //   });
  // }
}
