import React, { useEffect, useState } from "react";
import ServiceVeiculos from "src/services/ServiceVeiculos";
import swal from "sweetalert";
import "./formularioCadastroCSN.css";
import somaDebitoVeiculo from "src/Pages/Utils/somaDebitoVeiculo";
import { funcInputPontoParada, mensagemPlacaEmUso } from "./management";
import ViewsForm from "./ViewsForm";
import ServiceCargas from "src/services/ServiceCargas";
//import Swal2 from "sweetalert2";
function FormularioCadastroCSN({
	formik,
	produtos,
	viewsInput,
	buscarCargaComDocumentoDeTransporte,
	handleEnter,
	history,
	isPermissionUser,
}) {
	const [veiculo, setVeiculo] = useState(null);
	const [isDetalhesVeiculo, setDetalesVeiculo] = useState(null);
	const [isDetalhesCarreta, setDetalesCarreta] = useState(null);
	const [debitosVeiculo, setDebitosVeiculo] = useState(null);
	const [valorTotalDebito, setValorTotal] = useState();
	const [inputColeta5, setInputColeta5] = useState(false);
	const [inputColeta6, setInputColeta6] = useState(false);
	const [inputColeta7, setInputColeta7] = useState(false);
	const [inputColeta8, setInputColeta8] = useState(false);
	const [inputColeta9, setInputColeta9] = useState(false);
	const [inputColeta10, setInputColeta10] = useState(false);
	const [countInput, setCountInput] = useState(3);
	const [viewsButtonAddColeta, setViewsButtonAddColeta] = useState(true);
	const [viewsButtonExcluir, setViewsButtonExcluir] = useState(false);
	const fkSituacao =
		formik.values?.fk_situacao === 1 ||
		formik.values?.fk_situacao === 2 ||
		formik.values?.fk_situacao === undefined
			? false
			: true;

	useEffect(() => {
		if (viewsInput > 4) {
			functionInputs.viewsInputColeta();
		}
	}, [viewsInput]);

	async function handleShowDetailsAboutVehicle(plate) {
		if (!plate) {
			swal("Placa inválida");
			return;
		}

		let vehicleData;
		if (isDetalhesVeiculo) {
			vehicleData = isDetalhesVeiculo;
		} else {
			vehicleData = (await ServiceVeiculos.detalhesImpedimentos(plate)).data
				.data;
		}
		if (!vehicleData) {
			swal("Não foi encontrado nenhum veículo com essa placa.");
		}

		let placaCarreta = formik.values.placa_carreta;
		if (isDetalhesVeiculo === null) {
			const detailVeiculo = (await ServiceVeiculos.get(plate)).data.data;
			setDetalesVeiculo(detailVeiculo);
			placaCarreta = detailVeiculo?.placa_carreta;
		}

		const resultCarreta = await (
			await ServiceVeiculos.detalhesImpedimentos(placaCarreta)
		).data.data;

		if (resultCarreta) setDetalesCarreta(resultCarreta);
		setVeiculo(vehicleData);
	}

	useEffect(() => {
		if (formik.values.e_lote) {
			formik.setFieldValue("placa_veiculo", null);
			formik.setFieldValue("placa_carreta", null);
			formik.setFieldValue("placa_bitrem", null);
			formik.setFieldValue("codigo_motorista", null);
			formik.setFieldValue("nome_motorista", null);
		}
	}, [formik.values.e_lote]);

	async function handleSearchVehicle(plate) {
		if (plate) {
			const vehicleDetails = (await ServiceVeiculos.get(plate)).data.data;
			if (vehicleDetails) {
				formik.setFieldValue("placa_carreta", vehicleDetails.placa_carreta);
				formik.setFieldValue("placa_bitrem", vehicleDetails.placa_bitrem);
				formik.setFieldValue("nome_motorista", vehicleDetails.nome_motorista);
				formik.setFieldValue(
					"codigo_motorista",
					vehicleDetails.codigo_motorista
				);
				const { data } = (
					await ServiceCargas.searchCsnPlacaFkSituacao({ placa: plate })
				).data;

				if (data.results?.length) {
					const { id, fk_situacao } = data.results[0];
					mensagemPlacaEmUso(id, fk_situacao, plate, history, formik);
				}

				const detalhesVeiculos = (
					await ServiceVeiculos.detalhesImpedimentos(plate)
				).data.data;

				if (detalhesVeiculos?.RASTREADOR?.length > 2) {
					await formik.setFieldValue("rastreador", detalhesVeiculos.RASTREADOR);
				} else {
					await formik.setFieldValue("rastreador", "Sem rastreador");
				}

				setDetalesVeiculo(detalhesVeiculos);
				return;
			} else {
				swal("Não foi encontrado nenhum veículo com essa placa.");
			}
		}
		formik.setFieldValue("placa_carreta", null);
		formik.setFieldValue("placa_bitrem", null);
		formik.setFieldValue("codigo_motorista", null);
		formik.setFieldValue("nome_motorista", null);
	}

	async function handleShowDebitAboutVehicle(plate) {
		if (!plate) {
			swal("Placa inválida");
			return;
		}
		const debitos = (await ServiceVeiculos.debitos(plate)).data.data;
		if (debitos.length === 0) {
			swal("Nenhum débito encontrado.");
		} else {
			const totalDebitosVeic = await somaDebitoVeiculo(debitos);

			setValorTotal(totalDebitosVeic);

			setDebitosVeiculo(debitos);
		}
	}

	const functionInputs = funcInputPontoParada(
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
		setInputColeta10
	);

	return (
		<div className="class-body-form">
			<ViewsForm
				formik={formik}
				buscarCargaComDocumentoDeTransporte={
					buscarCargaComDocumentoDeTransporte
				}
				handleSearchVehicle={handleSearchVehicle}
				handleShowDetailsAboutVehicle={handleShowDetailsAboutVehicle}
				handleShowDebitAboutVehicle={handleShowDebitAboutVehicle}
				produtos={produtos}
				inputColeta5={inputColeta5}
				inputColeta6={inputColeta6}
				inputColeta7={inputColeta7}
				inputColeta8={inputColeta8}
				inputColeta9={inputColeta9}
				inputColeta10={inputColeta10}
				viewsButtonAddColeta={viewsButtonAddColeta}
				functionInputs={functionInputs}
				viewsButtonExcluir={viewsButtonExcluir}
				veiculo={veiculo}
				debitosVeiculo={debitosVeiculo}
				setDebitosVeiculo={setDebitosVeiculo}
				setVeiculo={setVeiculo}
				isDetalhesCarreta={isDetalhesCarreta}
				//isDetalhesVeiculo={isDetalhesVeiculo}
				valorTotalDebito={valorTotalDebito}
				fkSituacao={fkSituacao}
				handleEnter={handleEnter}
				isPermissionUser={isPermissionUser}
			/>
		</div>
	);
}

export default FormularioCadastroCSN;
