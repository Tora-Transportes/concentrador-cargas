import ServiceUsuarios from "src/services/ServiceUsuarios";
import swal from "sweetalert";
import Swal2 from "sweetalert2";

const funcMsgAlert = async (msg) => {
  const ok = await Swal2.fire({
    title: "Atenção!",
    text: msg,
    showCancelButton: true,
    confirmButtonColor: "red",
    cancelButtonColor: "#A9A9A9",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  });

  return ok?.isConfirmed;
};

export const addOrDelAllPermissios = async (permissions, status) => {
  if (!permissions.length) {
    await swal("", "Selecione uma das permissões", "warning");
  } else if (status === "Add") {
    if (
      await funcMsgAlert(
        "Tem certeza que deseja adicionar as permissões selecionadas a todos os usuários?"
      )
    ) {
      const permissoes = await permissions.map((item) => item.name);
      await ServiceUsuarios.addAllPermissions(permissoes);
      await swal("Sucesso", "Permissões adicionadas.", "success");
      window.location.reload();
    }
  } else {
    if (
      await funcMsgAlert(
        "Tem certeza que deseja deletar as permissões selecionadas a todos os usuários?"
      )
    ) {
      const permissoes = await permissions.map((item) => item.name);
      await ServiceUsuarios.DeleteAllPermissions(permissoes);
      await swal("Sucesso", "Permissões deletadas", "success");
      window.location.reload();
    }
  }
};
