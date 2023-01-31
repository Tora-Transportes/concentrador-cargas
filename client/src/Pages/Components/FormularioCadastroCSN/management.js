import moment from "moment";
import Swal2 from "sweetalert2";
import ServiceCargas from "src/services/ServiceCargas";

export const funcInputPontoParada = (
	formik,
	countInput,
	setCountInput,
	setViewsButtonExcluir,
	setViewsButtonAddColeta,
	setInputColeta5,
	setInputColeta6,
	setInputColeta7
) => {
	const viewsInputColeta = () => {
		switch (countInput) {
			case 3:
				setInputColeta5(true);
				setCountInput(countInput + 1);
				setViewsButtonExcluir(true);
				break;
			case 4:
				setInputColeta6(true);
				setCountInput(countInput + 1);
				break;
			case 5:
				setInputColeta7(true);
				setCountInput(countInput + 1);
				break;
			default:
				return;
		}
	};

	const funcDeletarParada = async (id) => {
		ServiceCargas.deletePontoParada({ id });
	};

	const excluirInputColeta = async (dados) => {
		switch (countInput) {
			case 4:
				if (dados === "delete") {
					const id = await formik.values.ponto_passagem5.id;
					if (id?.length) funcDeletarParada(id);
				}
				formik.setFieldValue("ponto_passagem5.ponto", "");
				formik.setFieldValue("ponto_passagem5.tipoServico", "");
				formik.setFieldValue("ponto_passagem5.previsao", "");
				formik.setFieldValue("ponto_passagem5.latitude", "");
				formik.setFieldValue("ponto_passagem5.longitude", "");
				formik.setFieldValue("ponto_passagem5.previsaoSaida", "");
				setCountInput(countInput - 1);
				setInputColeta5(false);
				setViewsButtonExcluir(false);

				break;
			case 5:
				if (dados === "delete") {
					const id = await formik.values.ponto_passagem6.id;
					if (id?.length) funcDeletarParada(id);
				}
				formik.setFieldValue("ponto_passagem6.ponto", "");
				formik.setFieldValue("ponto_passagem6.tipoServico", "");
				formik.setFieldValue("ponto_passagem6.previsao", "");
				formik.setFieldValue("ponto_passagem.latitude", "");
				formik.setFieldValue("ponto_passagem6.longitude", "");
				formik.setFieldValue("ponto_passagem6.previsaoSaida", "");
				setCountInput(countInput - 1);
				setInputColeta6(false);
				break;
			case 6:
				if (dados === "delete") {
					const id = await formik.values.ponto_passagem7.id;
					if (id?.length) funcDeletarParada(id);
				}
				formik.setFieldValue("ponto_passagem7.ponto", "");
				formik.setFieldValue("ponto_passagem7.tipoServico", "");
				formik.setFieldValue("ponto_passagem7.previsao", "");
				formik.setFieldValue("ponto_passagem7.latitude", "");
				formik.setFieldValue("ponto_passagem7.longitude", "");
				formik.setFieldValue("ponto_passagem7.previsaoSaida", "");
				setCountInput(countInput - 1);
				setInputColeta7(false);
				setViewsButtonAddColeta(true);
				break;
			default:
				return;
		}
	};
	return { viewsInputColeta, excluirInputColeta };
};

export const funcDuracaoProcesso = async (formik, status, coletafim) => {
	const somarHoras = (coletaInicio, nomeCampoformik) => {
		if (coletaInicio && coletafim) {
			const startTime = moment(coletaInicio);
			const endTime = moment(coletafim);
			const horasPermanenciaLocal = moment
				.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss")))
				.format("HH:mm:ss");
			formik.setFieldValue(nomeCampoformik, horasPermanenciaLocal);
		}
	};

	switch (status) {
		case 1:
			somarHoras(
				formik.values.ponto_passagem.coletaEfetiva_posto30,
				"ponto_passagem.tempServicoLocal"
			);

			break;
		case 2:
			somarHoras(
				formik.values.ponto_passagem2.coletaEfetiva_mundo,

				"ponto_passagem2.tempServicoLocal"
			);
			break;
		case 3:
			somarHoras(
				formik.values.ponto_passagem3.coletaEfetiva_peacao,
				"ponto_passagem3.tempServicoLocal"
			);
			break;
		case 4:
			somarHoras(
				formik.values.ponto_passagem4.entregaEfetiva,
				"ponto_passagem4.tempServicoLocalEntrega"
			);

			break;
		case 5:
			somarHoras(
				formik.values.ponto_passagem5.coletaEfetiva,
				"ponto_passagem5.tempServicoLocal"
			);
			break;
		case 6:
			somarHoras(
				formik.values.ponto_passagem6.coletaEfetiva,
				"ponto_passagem6.tempServicoLocal"
			);
			break;
		case 7:
			somarHoras(
				formik.values.ponto_passagem7.coletaEfetiva,
				"ponto_passagem7.tempServicoLocal"
			);
			break;
		case 11:
			formik.setFieldValue("ponto_passagem4.entregaFinal", 1);

			break;
		default:
			break;
	}
};

export const mensagemPlacaEmUso = (id, fk_situacao, plate, history, formik) => {
	const myhtml = document.createElement("div");
	myhtml.innerHTML = `Já existe uma carga aberta com a placa: ${plate} e o código: ${id}.<br><br>
	Para continuar, finalize a carga ou adicione outra placa.`;

	Swal2.fire({
		title: "Atenção!",
		html: myhtml,
		showCancelButton: true,
		confirmButtonColor: "#00652e",
		cancelButtonColor: "#3085d6",
		cancelButtonText: "Adicionar outra placa",
		confirmButtonText: "Finalizar carga",
		allowOutsideClick: false,
	}).then((result) => {
		if (result.isConfirmed) {
			if (fk_situacao === 2) {
				history.push(`/veiculos/aprovacao/csn-${id}`);
			} else {
				history.push(`/cargas/csn/${id}`);
			}
		} else {
			formik.setFieldValue("placa_veiculo", "");
		}
	});
};

export const InputReferencError = [
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
	{ error: false },
];

export const validInputPreenchidos = (
	date,
	indexInput,
	isCountInputPrenchido,
	setCountInputPrenchido
) => {
	let resultValidation = false;
	const inputsParaValidar = [2, 3, 6, 7, 10, 11, 23, 24];
	if (date !== null && inputsParaValidar.includes(indexInput)) {
		const numeroInputPrenchido = isCountInputPrenchido + 1;
		setCountInputPrenchido(numeroInputPrenchido);
		resultValidation = numeroInputPrenchido < 8 ? false : true;
	}
	return resultValidation;
};
