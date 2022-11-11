import * as yup from "yup";

export function factoryPontoParada() {
  const cargaCsnValidator = yup.object({
    ID_CON_CARGAS: yup.number().required("O id da carga deve ser preenchido"),
    ID_ROTAS_CSN: yup.number().required("O id do rota csn deve ser preenchido"),
    STATUS_SERVICO: yup
      .string()
      .required("O status da carga deve ser preenchido"),
    PREVISAO: yup.date(),
    DATA_CADASTRO: yup.date(),
    DATA_ATUALIZACAO: yup.date(),
  });
  return cargaCsnValidator;
}
