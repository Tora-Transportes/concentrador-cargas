import * as yup from "yup";

export function factoryCargaCsnValidator() {
  const cargaCsnValidator = yup.object({
    OBSERVACAO: yup
      .string()
      .required("A observão da carga csn deve ser preenchido"),
    LATITUDE: yup
      .number()
      .required("A latitude da carga csn deve ser preenchido"),
    LONGITUDE: yup
      .number()
      .required("A longitude da carga csn deve ser preenchido"),
    DATA_CADASTRO: yup.date(),
    DATA_ATUALIZACAO: yup.date(),
  });
  return cargaCsnValidator;
}
