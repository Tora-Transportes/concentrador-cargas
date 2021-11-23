import * as yup from "yup";

export function factoryCargaValidator(canal_comunicacao: string) {
  const letter = canal_comunicacao.toUpperCase()[0];
  const regexId = new RegExp(`^${letter}-[0-9]+$`, "g");

  const cargaValidator = yup.object({
    informacoes_restritivas: yup.string().nullable(),
    responsavel_cadastro: yup
      .string()
      .required("O responsavel pelo cadastro deve ser preenchido"),
    id: yup
      .string()
      .required("O id deve ser informado")
      .matches(regexId, `O id deve seguir o formato ${letter}-{NUMERO}`),
    e_lote: yup
      .bool()
      .required("Deve ser informado se a carga é um lote ou não"),
    cliente: yup.string().required("O cliente deve ser informado"),
    destino_carga: yup.string().required("O destino deve ser preenchido"),
    origem_carga: yup
      .string()
      .required("A origem da carga deve ser preenchida"),
    data_coleta: yup.date().required("A data de coleta deve ser preenchido"),
    data_entrega: yup.date().required("A data de entrega deve ser preenchido"),
    tipo_carga: yup.string().required("O tipo da carga deve ser preenchido"),
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
        new RegExp("^(ligacao|email|whatsapp|portal)$", "g"),
        "O local de criação da carga informado é inválido, deve ser algum desses [ligacao,email,whatsapp,portal]"
      ),
  });

  return cargaValidator;
}
