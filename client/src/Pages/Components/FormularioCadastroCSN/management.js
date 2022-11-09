export const funcInputPontoParada = (
	formik,
	countInput,
	setCountInput,
	setViewsButtonExcluir,
	setViewsButtonAddColeta,
	setInputColeta2,
	setInputColeta3,
	setInputColeta4,
	setInputColeta5,
	setInputColeta6
) => {
	const viewsInputColeta = () => {
		switch (countInput) {
			case 0:
				setInputColeta2(true);
				setViewsButtonExcluir(true);
				setCountInput(countInput + 1);
				break;
			case 1:
				setInputColeta3(true);
				setCountInput(countInput + 1);
				break;
			case 2:
				setInputColeta4(true);
				setCountInput(countInput + 1);
				break;
			case 3:
				setInputColeta5(true);
				setCountInput(countInput + 1);
				break;
			case 4:
				setInputColeta6(true);
				setViewsButtonAddColeta(false);
				setCountInput(countInput + 1);
				break;
			default:
				console.log("Entrou no defalt");
		}
	};

	const excluirInputColeta = () => {
		switch (countInput) {
			case 1:
				formik.setFieldValue("ponto_passagem2.ponto", "");
				formik.setFieldValue("ponto_passagem2.tipoServico", "");
				formik.setFieldValue("ponto_passagem2.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta2(false);
				setViewsButtonExcluir(false);
				break;
			case 2:
				formik.setFieldValue("ponto_passagem3.ponto", "");
				formik.setFieldValue("ponto_passagem3.tipoServico", "");
				formik.setFieldValue("ponto_passagem3.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta3(false);
				break;
			case 3:
				formik.setFieldValue("ponto_passagem4.ponto", "");
				formik.setFieldValue("ponto_passagem4.tipoServico", "");
				formik.setFieldValue("ponto_passagem4.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta4(false);
				break;
			case 4:
				formik.setFieldValue("ponto_passagem5.ponto", "");
				formik.setFieldValue("ponto_passagem5.tipoServico", "");
				formik.setFieldValue("ponto_passagem5.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta5(false);
				break;
			case 5:
				formik.setFieldValue("ponto_passagem6.ponto", "");
				formik.setFieldValue("ponto_passagem6.tipoServico", "");
				formik.setFieldValue("ponto_passagem6.previsao", "");
				setCountInput(countInput - 1);
				setViewsButtonAddColeta(true);
				setInputColeta6(false);
				break;
			default:
				console.log("Erro na contagem");
		}
	};

	return { viewsInputColeta, excluirInputColeta };
};
