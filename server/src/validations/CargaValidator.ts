import * as yup from "yup";

export function factoryCargaValidator() {
  const regexId = new RegExp(`^[A-Z]-[0-9]+$`, "g");

  const cargaValidator = yup.object({
    local_entrega: yup.string().nullable(),
    local_coleta: yup.string().nullable(),
    janela_entrega: yup.string().nullable(),
    janela_coleta: yup.string().nullable(),
    informacoes_restritivas: yup.string().nullable(),
    responsavel_cadastro: yup
      .string()
      .required("O responsavel pelo cadastro deve ser preenchido"),
    id: yup
      .string()
      .required("O id deve ser informado")
      .matches(regexId, `O id deve seguir o formato [LETRA]-{NUMERO}`),
    e_lote: yup
      .bool()
      .required("Deve ser informado se a carga é um lote ou não"),
    cliente: yup.string().required("O cliente deve ser informado"),
    destino_carga: yup.string().required("O destino deve ser preenchido"),
    origem_carga: yup
      .string()
      .required("A origem da carga deve ser preenchida"),
    data_coleta: yup.date().nullable(),
    data_entrega: yup.date().nullable(),
    tipo_carga: yup.string().nullable(),
    quantidade: yup
      .number()
      .min(0)
      .required("A quantidade da carga deve ser preenchido"),
    unidade_medida: yup
      .string()
      .required("A unidade de medida da carga deve ser preenchido"),
    observacao: yup.string().nullable(),
    acessorios_requisitos: yup.string().nullable(),
    canal_comunicacao: yup
      .string()
      .required("O local da criação da carga deve ser preenchida")
      .matches(
        new RegExp("^(manual|portal)$", "g"),
        "O local de criação da carga informado é inválido, deve ser algum desses [manual ou portal]"
      ),
  });

  return cargaValidator;
}
