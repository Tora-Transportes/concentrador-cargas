import * as yup from "yup";

export function factoryCargaCsnValidator() {
  const cargaCsnValidator = yup.object({
    DESCRICAO: yup
      .string()
      .required("A Descrição da carga csn deve ser preenchido !"),
    LATITUDE: yup
      .string()
      .required("A latitude da carga csn deve ser preenchido !"),
    LONGITUDE: yup
      .string()
      .required("A longitude da carga csn deve ser preenchido !"),
    DATA_CADASTRO: yup.date(),
    DATA_ATUALIZACAO: yup.date(),
    RAIO: yup.string().required("Raio csn deve ser prenchido!"),
  });
  return cargaCsnValidator;
}
