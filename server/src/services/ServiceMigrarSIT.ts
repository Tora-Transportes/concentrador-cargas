import { ICarga } from "../models/ICargas";
import database from "../database";
import { IServiceSit } from "../domain/UseCaseCarga/entities";

class ServiceMigrarSit implements IServiceSit {
  async consultaVeiculo(placa: string) {
    return await database.raw(
      `
    select VEICULO.VEI_COD as "id_veiculo",
      TIPO_VEICULO.TV_COD as "id_tipo_veiculo",
      TIPO_VEICULO.TV_DSC as "descricao",
      VEICULO.VEI_PLACA as "placa",
      VEICULO.VEI_ANO as "ano",
      VEICULO.VEI_CHASSIS as "chassis",
      CARRETA.VEI_PLACA as "placa_carreta",
      BITREM.VEI_PLACA as "placa_bitrem",
      CADASTRO_GERAL.CG_NOME as "nome_motorista",
      CG_ID.CGI_NUM as "cpf_motorista",
      CG_ID_PROP.CGI_NUM as "documento_proprietario"

      from TIPO_VEICULO
      JOIN VEICULO ON VEICULO.TV_COD = TIPO_VEICULO.TV_COD
      LEFT JOIN VEICULO CARRETA on CARRETA.VEI_COD = VEICULO.COD_CARRETA
      LEFT JOIN VEICULO BITREM on BITREM.VEI_COD = VEICULO.COD_BITREM
      LEFT JOIN CADASTRO_GERAL on CADASTRO_GERAL.CG_COD = VEICULO.CG_MOT

      LEFT JOIN (SELECT * FROM CG_IDENTIFICACAO WHERE CG_IDENTIFICACAO.TI_COD = 2) CG_ID ON CG_ID.CG_COD = CADASTRO_GERAL.CG_COD
      LEFT JOIN (SELECT * FROM CG_IDENTIFICACAO WHERE CG_IDENTIFICACAO.TI_COD IN (6, 2, 5)) CG_ID_PROP ON CG_ID_PROP.CG_COD = CADASTRO_GERAL.CG_COD

      WHERE VEICULO.VEI_PLACA = ?
    `,
      [placa]
    );
  }

  async consultaIBGE(uf: string, cidade: string) {
    return database("CIDADE")
      .select([
        "CID_NOM as cidade",
        "UF_SIGLA as uf",
        "CIDADE.COD_IBGE as codigo_ibge",
      ])
      .join("ESTADO", "ESTADO.UF_COD", "CIDADE.UF_COD")
      .where("UF_SIGLA", uf)
      .where("CID_NOM", cidade)
      .first();
  }

  async converter(carga: ICarga) {
    if (!carga.placa_veiculo) {
      throw new Error("A carga não possui um veículo atribuido");
    }

    if (carga.cliente.split(" - ").length !== 3) {
      throw new Error(
        "Nome do cliente não se encontra no formato 'NOME - CNPJ - LOCAL'"
      );
    }

    const dadosVeiculo = await this.consultaVeiculo(carga.placa_veiculo);
    if (dadosVeiculo.length === 0) {
      throw new Error("Dados do veículo não encontrados por meio da consulta");
    }

    if (!carga.origem_carga || !carga.destino_carga) {
      throw new Error("A carga não possui nenhuma origem e nenhum destino");
    }

    const [, uf_origem, cidade_origem] = carga.origem_carga.split("/");
    const [, uf_destino, cidade_destino] = carga.destino_carga.split("/");

    const ibgeOrigem = await this.consultaIBGE(uf_origem, cidade_origem);
    const ibgeDestino = await this.consultaIBGE(uf_destino, cidade_destino);

    let dataAtualizacao = new Date(carga.data_atualizacao || "");
    if (isNaN(Number(dataAtualizacao))) {
      dataAtualizacao = new Date();
    }

    return {
      FIL_COD: 26,
      STF_COD: 19,
      COD_EMPRESA_SAP: "2000",
      COD_AGENDAMENTO_ATS: carga.id.replace(/\D/g, ""),
      CGI_NUM_MOT: dadosVeiculo[0].cpf_motorista,
      CGI_NUM_PROP: dadosVeiculo[0].documento_proprietario,
      VEI_PLACA_CAV: dadosVeiculo[0].placa,
      VEI_PLACA_CAR: dadosVeiculo[0].placa_carreta,
      VEI_PLACA_BIT: dadosVeiculo[0].placa_bitrem,
      VEI_PLACA_TRI: null,
      PCA_DOC_FEDERAL_CLIE: carga.cliente.split(" - ")[1],
      CGI_NUM_PROGR: carga.usuario,
      SHIPMENT: carga.documento_transporte,
      CGI_NUM_RP_L: null,
      KM_TOTAL_TRANSPORTE: null,
      NOMEMAT_PROGR: null,
      COD_ORI_TKP: null,
      COD_DES_TKP: null,
      COD_ATS_CID_ORG: 0,
      VALOR_FRETE_A_PAGAR: 0,
      MDA_COD: 0,
      COD_ATS_CID_DES: 0,
      COD_SOLICITACAO_TKP: 0,
      HORA_PROGRAMACAO: dataAtualizacao,
      DATA_PROGRAMACAO: dataAtualizacao,
      DATA_HORA_PROGR: dataAtualizacao,
      DATA_HORAINSERCAOSIT: new Date(),

      COD_IBGE_ORI: ibgeOrigem?.codigo_ibge,
      COD_IBGE_DES: ibgeDestino?.codigo_ibge,
    };
  }

  async migrar(cargas: ICarga[]) {
    const insercoes = [];
    for (const i of cargas) {
      insercoes.push(this.converter(i));
    }
    await database("PRE_VIAGEM_ATS").insert(await Promise.all(insercoes));
  }
}

export default new ServiceMigrarSit();

// const carga = {
//   id: "M-1639673022149",
//   cliente:
//     "\t D MELO DE SOUZA HELITEC CONSTRUCAO E C - 06106604000284 - MANAUS/AM",
//   e_lote: false,
//   origem_carga: "BRASIL/MG/CONTAGEM",
//   destino_carga: "BRASIL/MG/BELO HORIZONTE",
//   data_entrega: null,
//   data_coleta: null,
//   tipo_carga: null,
//   quantidade: 1,
//   unidade_medida: "CX",
//   responsavel_cadastro: "Andre Alves Leocadio",
//   canal_comunicacao: "manual",
//   observacao: null,
//   data_cadastro: "2021-12-16T16:44:19.646Z",
//   data_atualizacao: "2021-12-16T16:44:19.646Z",
//   ativo: 1,
//   acessorios_requisitos: null,
//   usuario: "Andre Alves Leocadio",
//   informacoes_restritivas: null,
//   janela_coleta: null,
//   janela_entrega: null,
//   local_coleta: "12",
//   local_entrega: "21",
//   fk_lote_pai: null,
//   quantidade_atual: 1,
//   fk_situacao: 3,
//   placa_veiculo: "OUF9329",
//   observacao_gr: "pq sim",
//   documento_transporte: null,
// };

// migrar([carga]).then(console.log).catch(console.error);
