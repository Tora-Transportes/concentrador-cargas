import * as yup from "yup";

export function factoryCargaValidator() {
  const cargaValidator = yup.object({
    documento_transporte: yup.string().notRequired().nullable(),
    observacao_gr: yup.string().notRequired().nullable(),
    placa_veiculo: yup.string().nullable().notRequired(),
    usuario: yup.string().notRequired(),
    janela_entrega: yup.string().nullable(),
    janela_coleta: yup.string().nullable(),
    informacoes_restritivas: yup.string().nullable(),
    responsavel_cadastro: yup
      .string()
      .required("O responsavel pelo cadastro deve ser preenchido"),
    id: yup.number().required("O id deve ser informado"),
    e_lote: yup
      .bool()
      .required("Deve ser informado se a carga é um lote ou não"),
    cliente: yup.string().required("O cliente deve ser informado"),
    destino_carga: yup.string().nullable(),
    origem_carga: yup.string().nullable(),
    data_coleta: yup.date().nullable(),
    data_entrega: yup.date().nullable(),
    tipo_carga: yup.string().nullable(),
    quantidade: yup
      .number()
      .min(0)
      .required("A quantidade da carga deve ser preenchido"),
    quantidade_atual: yup.number().min(0),
    unidade_medida: yup
      .string()
      .required("A unidade de medida da carga deve ser preenchido"),
    observacao: yup.string().nullable(),
    acessorios_requisitos: yup.string().nullable(),
    canal_comunicacao: yup
      .string()
      .required("O local da criação da carga deve ser preenchida")
      .matches(
        new RegExp("^(manual|portal|email|robô)$", "g"),
        "O local de criação da carga informado é inválido, deve ser algum desses [manual ou portal]"
      ),
    fk_lote_pai: yup.string().nullable(),
    fk_situacao: yup.number(),
    fk_filial: yup.number().notRequired().nullable(),
    data_atualizacao: yup.date().notRequired(),
    observacao_cancelamento: yup.string().nullable().notRequired(),
    placa_carreta: yup.string().nullable().notRequired(),
    placa_bitrem: yup.string().nullable().notRequired(),
    codigo_motorista: yup.number().nullable().notRequired(),
    locais: yup.array().of(yup.string()).notRequired(),
    carga_csn: yup.number().nullable().notRequired(),
    rastreador: yup.string().nullable().notRequired(),
    carga_app: yup.number().nullable().notRequired(),
    valor_frete: yup.number().nullable().notRequired(),
  });

  return cargaValidator;
}
