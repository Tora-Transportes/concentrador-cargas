import * as yup from "yup";

export function factoryPontoParada() {
  const cargaCsnValidator = yup.object({
    ID_CON_CARGAS: yup.number().required("O id da carga deve ser preenchido"),
    ID_ROTAS_CSN: yup.number().nullable(),
    STATUS_SERVICO: yup
      .string()
      .required("O status da carga deve ser preenchido"),
    PREVISAO: yup.date(),
    LATITUDE: yup.string().nullable(),
    LONGITUDE: yup.string().nullable(),
    DATA_CADASTRO: yup.date(),
    DATA_ATUALIZACAO: yup.date().nullable(),
    CLIENTE: yup.string().nullable(),
    COLETA_EFETIVA: yup.date().nullable(),
    COLETA_EFETIVA_POSTO30: yup.date().nullable(),
    COLETA_EFETIVA_MUNDO: yup.date().nullable(),
    COLETA_EFETIVA_PEACAO: yup.date().nullable(),
    ENTREGA_EFETIVA: yup.date().nullable(),
    SAIDA_EFETIVA_COLETA: yup.date().nullable(),
    TEMP_SERV_LOCAL_COLETA: yup.string().nullable(),
    PREVISAO_SAIDA: yup.date().nullable(),
    SAIDA_EFETIVA_ENTREGA: yup.date().nullable(),
    TEMP_SERV_LOCAL_ENTREGA: yup.string().nullable(),
    ENTREGA_FINAL: yup.number().nullable(),
  });
  return cargaCsnValidator;
}
