export const funcInputPontoParada = (
	formik,
	countInput,
	setCountInput,
	setViewsButtonExcluir,
	setViewsButtonAddColeta,
	setInputColeta5,
	setInputColeta6,
	setInputColeta7,
	setInputColeta8,
	setInputColeta9,
	setInputColeta10,
	setInputColeta11,
	setInputColeta12
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
			case 6:
				setInputColeta8(true);
				setCountInput(countInput + 1);
				break;
			case 7:
				setInputColeta9(true);
				setCountInput(countInput + 1);
				break;
			case 8:
				setInputColeta10(true);
				setCountInput(countInput + 1);
				break;
			case 9:
				setInputColeta11(true);
				setCountInput(countInput + 1);
				break;
			case 10:
				setInputColeta12(true);
				setViewsButtonAddColeta(false);
				setCountInput(countInput + 1);
				break;
			default:
				return;
		}
	};

	const excluirInputColeta = () => {
		switch (countInput) {
			case 4:
				formik.setFieldValue("ponto_passagem5.ponto", "");
				formik.setFieldValue("ponto_passagem5.tipoServico", "");
				formik.setFieldValue("ponto_passagem5.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta5(false);
				setViewsButtonExcluir(false);
				break;
			case 5:
				formik.setFieldValue("ponto_passagem6.ponto", "");
				formik.setFieldValue("ponto_passagem6.tipoServico", "");
				formik.setFieldValue("ponto_passagem6.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta6(false);
				break;
			case 6:
				formik.setFieldValue("ponto_passagem7.ponto", "");
				formik.setFieldValue("ponto_passagem7.tipoServico", "");
				formik.setFieldValue("ponto_passagem7.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta7(false);
				setViewsButtonAddColeta(true);
				break;
			case 7:
				formik.setFieldValue("ponto_passagem8.ponto", "");
				formik.setFieldValue("ponto_passagem8.tipoServico", "");
				formik.setFieldValue("ponto_passagem8.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta8(false);
				setViewsButtonAddColeta(true);
				break;
			case 8:
				formik.setFieldValue("ponto_passagem9.ponto", "");
				formik.setFieldValue("ponto_passagem9.tipoServico", "");
				formik.setFieldValue("ponto_passagem9.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta9(false);
				break;
			case 9:
				formik.setFieldValue("ponto_passagem10.ponto", "");
				formik.setFieldValue("ponto_passagem10.tipoServico", "");
				formik.setFieldValue("ponto_passagem10.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta10(false);
				break;
			case 10:
				formik.setFieldValue("ponto_passagem11.ponto", "");
				formik.setFieldValue("ponto_passagem11.tipoServico", "");
				formik.setFieldValue("ponto_passagem11.previsao", "");
				setCountInput(countInput - 1);
				setInputColeta11(false);
				break;
			case 11:
				formik.setFieldValue("ponto_passagem12.ponto", "");
				formik.setFieldValue("ponto_passagem12.tipoServico", "");
				formik.setFieldValue("ponto_passagem12.previsao", "");
				setCountInput(countInput - 1);
				setViewsButtonAddColeta(true);
				setInputColeta12(false);
				break;
			default:
				return;
		}
	};

	return { viewsInputColeta, excluirInputColeta };
};
