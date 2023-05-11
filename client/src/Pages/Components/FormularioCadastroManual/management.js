import swal from "sweetalert2";

import ServiceVeiculos from "../../../services/ServiceVeiculos";
import utils from "../../Utils/date";

export const verificarManutencaoVeiculo = async (plate, status) => {
	const infoManutencao = (await ServiceVeiculos.manutencao(plate)).data.data;

	const showMsgInfoManutencao = () => {
		const dias = infoManutencao.QTDE_DIAS?.toString().replace("-", "");
		let title = "Veículo com manutenção vencida!";
		let detalesVencimento = `Manutenção vencida a ${dias} dias!`;

		if (status === "info") {
			title = "Informações de Manutenção !";
			detalesVencimento = `Faltam ${dias} dias para a manutenção vencer!`;
		}
		const myhtml = document.createElement("div");
		const categoria =
			infoManutencao.VEI_CATEGORIA === "A" ? "Agregado" : "Frota Própia";
		myhtml.innerHTML = `Descrição: ${infoManutencao.DESCRICAO},<br>   
    Data Inicio: ${
			utils.formatDateTresHorasMenos(infoManutencao.VEI_DT_MANUT).split("-")[0]
		},<br>  
    Data Vencimento: ${
			utils
				.formatDateTresHorasMenos(infoManutencao.VEI_DT_MANUT_LUB)
				.split("-")[0]
		},<br>  
    ${detalesVencimento}<br>
    Categoria: ${categoria}.`;
		swal.fire({
			title,
			html: myhtml,
			confirmButtonColor: "#00652e",
			allowOutsideClick: false,
		});
	};

	if (
		infoManutencao?.DESCRICAO === "MANUTENÇÃO VENCIDA" &&
		status === "alerta"
	) {
		showMsgInfoManutencao();
	} else if (infoManutencao && status === "info") {
		showMsgInfoManutencao();
	} else if (status === "info" && !infoManutencao)
		swal.fire({
			text: "VEÍCULO SEM INFORMAÇÃO DE MANUTENÇÃO.",
			confirmButtonColor: "#00652e",
			allowOutsideClick: false,
		});
};
