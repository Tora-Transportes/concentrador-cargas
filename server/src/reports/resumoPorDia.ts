import database from "../database";

export interface IFiltroResumoDiario {
  fk_filial: string;
  data_inicio: string;
  data_final: string;
}

export class ReportResumoPorDia {
  async generate(filtro: IFiltroResumoDiario) {
    return database.raw(
      `
        select sum("c_cad"."quantidade") "total_peso_cadastrado", to_char("c_cad"."data_cadastro", 'yyyy-mm-dd') "data_cadastro", "c_cad"."fk_filial",  'KG' "unidade_medida",
        NVL("c_tot_peso_cad"."total_peso_transportado", 0) "total_peso_transportado", NVL("c_tot_viagem_cad"."viagens_realizadas", 0) "viagens_realizadas", FILIAL.FIL_DSC "nome_filial"
        
        from "con_cargas" "c_cad"
        
        left join (
            select sum("quantidade") "total_peso_transportado", to_char("data_atualizacao", 'yyyy-mm-dd') "data_cadastro", "fk_filial" from "con_cargas"
            where "e_lote" = 0 AND "fk_situacao" = 6
            group by to_char("data_atualizacao", 'yyyy-mm-dd'), "fk_filial"
            order  by to_char("data_atualizacao", 'yyyy-mm-dd')
        ) "c_tot_peso_cad" ON "c_tot_peso_cad"."data_cadastro" =  to_char("c_cad"."data_cadastro", 'yyyy-mm-dd') AND  "c_tot_peso_cad"."fk_filial" = "c_cad"."fk_filial"
        
        left join (
            select count("quantidade") "viagens_realizadas", to_char("data_atualizacao", 'yyyy-mm-dd') "data_cadastro", "fk_filial" from "con_cargas"
            where "e_lote" = 0 AND "fk_situacao" = 6
            group by to_char("data_atualizacao", 'yyyy-mm-dd'), "fk_filial"
            order  by to_char("data_atualizacao", 'yyyy-mm-dd')
        ) "c_tot_viagem_cad" ON "c_tot_viagem_cad"."data_cadastro" =  to_char("c_cad"."data_cadastro", 'yyyy-mm-dd') AND  "c_tot_viagem_cad"."fk_filial" = "c_cad"."fk_filial"
        
        left join FILIAL on FILIAL.FIL_COD = "c_cad"."fk_filial"
        
        where "c_cad"."e_lote" = 0
        and "c_cad"."fk_filial" = ?
        and to_char("c_cad"."data_cadastro", 'yyyy-mm-dd') >= ?
        and to_char("c_cad"."data_cadastro", 'yyyy-mm-dd') <= ?
        group by to_char("c_cad"."data_cadastro", 'yyyy-mm-dd'), "c_cad"."fk_filial", "c_tot_viagem_cad"."viagens_realizadas", "c_tot_peso_cad"."total_peso_transportado", FILIAL.FIL_DSC
        order  by to_char("c_cad"."data_cadastro", 'yyyy-mm-dd')
        `,
      [filtro.fk_filial, filtro.data_inicio, filtro.data_final]
    );
  }
}
