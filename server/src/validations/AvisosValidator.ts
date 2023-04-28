import * as yup from "yup";

export function factoryAvisos() {
  const avisosValidator = yup.object({
    ID: yup.number(),
    TITULO: yup.string().required("O titulo do aviso deve ser preenchido!"),
    MENSAGEM: yup
      .string()
      .required("A mensagem do  aviso deve ser preenchido!"),
    AUTOR: yup.string().required("O autor do aviso deve ser  preenchido!"),
    DATA_CADASTRO: yup.date(),
    DATA_ATUALIZACAO: yup.date().nullable(),
    LIKE_ON: yup.number(),
    LIKE_OF: yup.number(),
    RESPONSAVEL_EDICAO: yup.string(),
  });
  return avisosValidator;
}
