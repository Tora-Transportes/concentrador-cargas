import ServiceEngate from "src/services/ServiceEngate";
import ServiceVeiculos from "src/services/ServiceVeiculos";
import swal from "sweetalert";
import Swal from "sweetalert2";
import * as yup from "yup";

export const initialValues = {
  PLACA_VEICULO: "",
  PLACA_CARRETA_UM: "",
  PLACA_CARRETA_DOIS: "",
  PLACA_CARRETA_TRES: "",
  //FILIAL: "",
  STATUS: "Automático",
  ENGATE_DESENGATE: 1,
  FK_SITUACAO: null,
};

export const alertSwal = async (text, nameButton, bodyEnviar) => {
  return Swal.fire({
    title: "Atenção!",
    text,
    showCancelButton: true,
    confirmButtonColor: "#00652e",
    cancelButtonColor: "#3085d6",
    cancelButtonText: "Cancelar",
    confirmButtonText: nameButton,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      ServiceEngate.create(bodyEnviar);
      Swal.fire({
        text: "“Pedido de engate/desemgate enviado para aprovação”.",
      });
    }
  });
};

export const validations = yup.object().shape({
  PLACA_VEICULO: yup
    .string()
    .min(7, "Placa precisa ter no minimo 7 caracter.")
    .max(7, "Placa precisa ter no máximo 7 caracter.")
    .required("Placa é um campo obrigatório!"),
  // FILIAL: yup
  //   .string()
  //   .min(3, "Placa precisa ter no minimo 7 caracter.")
  //   .required("Filial é um campo obrigatório!"),
  // PLACA_CARRETA_UM: yup
  //   .string()
  //   .min(7, "Placa precisa ter no minimo 7 caracter.")
  //   .max(7, "Placa precisa ter no máximo 7 caracter."),
  // //.required("Placa do cavalo é um campo obrigatório!"),
  // PLACA_CARRETA_DOIS: yup
  //   .string()
  //   .min(7, "Placa precisa ter no minimo 7 caracter.")
  //   .max(7, "Placa precisa ter no máximo 7 caracter."),
});

export const exportarAditivo = (setLoadingButton, setNameButton) => {
  setLoadingButton(true);
  setTimeout(() => {
    setLoadingButton(false);
    setNameButton({ name: "PDF salvo!", cor: "#676967" }); //#7e097e
  }, 2000);
};

export async function handleSearchVehicle(plate, setInfoPlacaVeiculo) {
  if (plate) {
    const vehicleDetails = (await ServiceVeiculos.get(plate)).data.data;
    if (vehicleDetails) {
      setInfoPlacaVeiculo((valoresAtuais) => ({
        ...valoresAtuais,
        placa_carreta: vehicleDetails.placa_carreta ?? "",
        placa_bitrem: vehicleDetails.placa_bitrem ?? "Sem informação",
      }));
      return;
    } else {
      swal("Não foi encontrado nenhum veículo com essa placa.");
    }
  }
}
