import * as yup from "yup";

export function factoryLogsError() {
  const cargaCsnValidator = yup.object({
    message: yup.string(),
    nameFile: yup.string(),
    descricao: yup.string(),
    level: yup.string(),
    id: yup.string(),
  });
  return cargaCsnValidator;
}
