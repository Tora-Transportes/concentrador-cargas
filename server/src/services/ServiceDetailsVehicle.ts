import database from "../database";
export default class ServiceDetailsVehicle {
  async index(placa: string) {
    const details = await database.raw(
      `SELECT
        v.vei_cod AS CODIGO_VEICULO,
        v.loc_cod,
        nvl(v.vei_referencia, ' ') AS rastreador,
        v.vei_placa AS placa,
        v.vei_chassis AS chassi,
        v.tv_cod AS tv_cod,
        tv.tv_dsc AS tipo_veiculo,
        v.vei_dt_cadastro AS data_cadastro,
        v.vei_dt_atu AS data_atualizacao,
        v.vei_dt_afericao AS data_afericao,
        v.vei_categoria AS forca_trabalho,
        v.vei_modelo AS modelo,
        v.vei_renavam AS renavan,
        v.vei_cert_prop AS certificado_propietario,
        nvl(v.vei_tp_assoalho, ' ') AS tipo_assoalho,
        v.sv_cod AS sv_cod,
        sv.sv_dsc AS setor_veiculo,
        v.loc_locacao AS filial_locacao,
        f.LOC_DSC AS filial_nome,
        v.vei_cor AS cor,
        v.vei_ano AS ano_fabricacao,
        v.vei_ano_modelo AS ano_modelo,
        apv.av_dsc AS apelido,
        cg.cg_cod AS cod_proprietario,
        cg.cg_nome AS proprietario,
        TO_CHAR(v.VEI_DT_MANUT, 'dd/mm/yyyy') AS DATA_MANUTENCAO,
        TO_CHAR(v.VEI_DT_MANUT_LUB, 'dd/mm/yyyy') AS PROX_REVISAO,
        TO_CHAR((v.VEI_DT_MANUT_LUB - SYSDATE), '999999990') AS DIAS_PROX_REVISAO,
        ST.STF_DSC AS STATUS_VEICULO,
        (
            SELECT
                CD_MOT.CGD_DSC
            FROM
                USU_CENTRAL.CG_DETALHE CD_MOT
            WHERE
                CD_MOT.CG_COD = CGD_MOT.CG_COD
                AND CD_MOT.LOC_COD = CGD_MOT.LOC_COD
                AND CD_MOT.CGD_SEQ = (
                    select
                        nvl(max(CGD_SEQ), 0) as
                    from
                        CG_DETALHE CD
                    WHERE
                        CD.CG_COD = CD_MOT.CG_COD
                        AND CD.LOC_COD = CD_MOT.LOC_COD
                )
        ) AS OBS_MOT,
        (
            SELECT
                TA.TA_DSC
            FROM
                USU_CENTRAL.CG_DETALHE CD_MOT,
                TIPO_ATRIBUTO TA
            WHERE
                CD_MOT.CG_COD = CGD_MOT.CG_COD
                AND CD_MOT.LOC_COD = CGD_MOT.LOC_COD
                AND CD_MOT.TA_COD = TA.TA_COD
                AND CD_MOT.CGD_SEQ = (
                    select
                        nvl(max(CGD_SEQ), 0) as
                    from
                        CG_DETALHE CD
                    WHERE
                        CD.CG_COD = CD_MOT.CG_COD
                        AND CD.LOC_COD = CD_MOT.LOC_COD
                )
        ) AS STATUS_MOT,
        (
            SELECT
                TA.TA_DSC
            FROM
                USU_CENTRAL.CG_DETALHE CD_PROP,
                TIPO_ATRIBUTO TA
            WHERE
                CD_PROP.CG_COD = CGD_PROP.CG_COD
                AND CD_PROP.LOC_COD = CGD_PROP.LOC_COD
                AND CD_PROP.TA_COD = TA.TA_COD
                AND CD_PROP.CGD_SEQ = (
                    select
                        nvl(max(CGD_SEQ), 0) as
                    from
                        CG_DETALHE CD
                    WHERE
                        CD.CG_COD = CD_PROP.CG_COD
                        AND CD.LOC_COD = CD_PROP.LOC_COD
                )
        ) AS STATUS_PROP,
        (
            select DISTINCT CONCAT('(' || cga_ddd || ')',cga_dsc) "telefone" 
                from cg_agenda 
                where cg_cod = cg.cg_cod
                AND ta_cod in (2,10)
                AND loc_cod = cg.loc_cod
            ) As TELEFONE_MOTORISTA,
        (
            SELECT
                CD_PROP.CGD_DSC
            FROM
                USU_CENTRAL.CG_DETALHE CD_PROP
            WHERE
                CD_PROP.CG_COD = CGD_PROP.CG_COD
                AND CD_PROP.LOC_COD = CGD_PROP.LOC_COD
                AND CD_PROP.CGD_SEQ = (
                    select
                        nvl(max(CGD_SEQ), 0) as
                    from
                        CG_DETALHE CD
                    WHERE
                        CD.CG_COD = CD_PROP.CG_COD
                        AND CD.LOC_COD = CD_PROP.LOC_COD
                )
        ) AS OBS_PROP,
        CASE
            WHEN tv.tv_dsc LIKE '%AUTOMOVEL%' THEN 'VEICULO DE APOIO'
            WHEN tv.tv_dsc LIKE '%CARRETA%' THEN 'CARRETA'
            WHEN tv.tv_dsc LIKE '%CAMINHONETE%' THEN 'VEICULO DE APOIO'
            WHEN tv.tv_dsc LIKE '%CAMINHAO%' THEN 'FROTA LEVE'
            WHEN tv.tv_dsc LIKE '%CAVALO%' THEN 'FROTA PESADA'
            ELSE 'N_O SE APLICA'
        END AS aux2,
        CASE
            WHEN tv.tv_cod = 48 THEN '6X2'
            WHEN tv.tv_cod = 3 THEN '4X2'
            WHEN tv.tv_cod = 32 THEN '6X4'
            ELSE ' '
        END AS aux3,
        NVL(k.km, 0) KM,
        mv.mrv_dsc MARCA,
        nvl(
            (
                select
                    cg.cg_nome
                from
                    cadastro_geral cg
                where
                    cg.loc_cod = v.loc_emp_perm
                    and cg.cg_cod = v.cg_emp_perm
            ),
            ' '
        ) permissionaria,
        RAST.MCT_COD MCT,
        tecno.tecno_dsc TECNOLOGIA
    FROM
        veiculo v
        LEFT JOIN tipo_veiculo tv ON tv.tv_cod = v.tv_cod
        LEFT JOIN apelido_veiculo apv ON apv.av_seq = v.av_seq
        LEFT JOIN setor_veiculo sv ON sv.sv_cod = v.sv_cod
        LEFT JOIN cadastro_geral cg ON cg.cg_cod = v.cg_prop
        AND cg.loc_cod = v.loc_prop
        INNER JOIN USU_CENTRAL.STATUS ST ON ST.STF_COD = v.STF_COD
        LEFT JOIN USU_CENTRAL.CADASTRO_GERAL CGD_MOT ON CGD_MOT.CG_COD = V.CG_MOT
        AND CGD_MOT.LOC_COD = V.LOC_MOT
        LEFT JOIN USU_CENTRAL.CADASTRO_GERAL CGD_PROP ON CGD_PROP.CG_COD = V.CG_PROP
        AND CGD_PROP.LOC_COD = V.LOC_PROP
        left JOIN LOCAL F ON v.loc_locacao = f.LOC_COD
        LEFT JOIN (
            SELECT
                DVF.cod_cavalo,
                MAX(DVF_KM_FINAL) KM
            FROM
                DVF DVF
            GROUP BY
                DVF.cod_cavalo
        ) K ON k.cod_cavalo = v.vei_cod
        LEFT JOIN MARCA_VEICULO MV ON MV.MRV_COD = V.MRV_COD
        LEFT JOIN USU_CENTRAL.rastreador RAST ON RAST.LOC_COD = V.LOC_COD
        AND RAST.VEI_COD = V.VEI_COD
        LEFT JOIN usu_central.tecnologia_rastreador TECNO ON TECNO.TECNO_COD = rast.tecno_cod
    WHERE
        v.vei_placa != 'AAA0001'
        and v.vei_placa = ?
        AND tv.tv_cod NOT IN (
            52,
            50,
            72,
            40,
            53,
            39,
            36
        )`,
      [placa]
    );
    if (details.length === 0) {
      return null;
    }

    return details[0];
  }

  async debits(placa: string) {
    return database.raw(
      `
    select veiculo.vei_placa, desp_carreteiro.* from desp_carreteiro
    join veiculo on veiculo.vei_cod = desp_carreteiro.vei_cod
    where rpa_num is null
    and desp_carreteiro.stf_cod = 0
    and veiculo.vei_placa = ?
    order by DEC_DIA desc
    `,
      [placa]
    );
  }
}

// const service = new ServiceDetailsVehicle();
// service.index("GYI2802").then(console.log);
