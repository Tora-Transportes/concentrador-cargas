import * as yup from "yup";

export function factoryEngate() {
  return yup.object({
    ID: yup.number(),
    ENGATE_DESENGATE: yup
      .number()
      .required(
        "O valor 0 ou 1 deve ser informado para indicar o engate ou desengate."
      ),
    PLACA_VEICULO: yup
      .string()
      .required("Placa do veiculo deve ser informado."),
    PLACA_CARRETA_UM: yup
      .string()
      .required("Placa do veiculo Um(1) deve ser informado"),
    PLACA_CARRETA_DOIS: yup.string().nullable(),
    PLACA_CARRETA_TRES: yup.string().nullable(),
    STATUS: yup.string().required("Status deve ser informado."),
    DATA_ATUALIZACAO: yup.date().nullable(),
    DATA_CADASTRO: yup.date().nullable(),
    RESPONSAVEL_CADASTRO: yup
      .string()
      .required("O responsavel pelo cadastro deve ser informado."),
    USUARIO: yup.string().required("Usuário deve ser informado."),
    FK_SITUACAO: yup.number().nullable(),
  });
}
