import Swal from "sweetalert2";
import * as yup from "yup";

export const alertSwal = async (text, nameButton) => {
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
      console.log("Confirmou o desengate");
    }
  });
};

export const validations = yup.object().shape({
  placa_cavalo: yup
    .string()
    .min(7, "Placa precisa ter no minimo 7 caracter.")
    .max(7, "Placa precisa ter no máximo 7 caracter.")
    .required("Placa é um campo obrigatório!"),
});
