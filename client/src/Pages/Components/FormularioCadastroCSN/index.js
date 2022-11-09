import React, { useEffect, useState } from "react";
import ServiceVeiculos from "src/services/ServiceVeiculos";
import swal from "sweetalert";
import "./formularioCadastroCSN.css";
import { funcInputPontoParada } from "./management";
import ViewsForm from "./ViewsForm";

function FormularioCadastroCSN({
	formik,
	produtos,
	disabledFields = [],
	buscarCargaComDocumentoDeTransporte,
}) {
	const [veiculo, setVeiculo] = useState(null);
	const [debitosVeiculo, setDebitosVeiculo] = useState(null);
	const [inputColeta2, setInputColeta2] = useState(false);
	const [inputColeta3, setInputColeta3] = useState(false);
	const [inputColeta4, setInputColeta4] = useState(false);
	const [inputColeta5, setInputColeta5] = useState(false);
	const [inputColeta6, setInputColeta6] = useState(false);
	const [countInput, setCountInput] = useState(0);
	const [viewsButtonAddColeta, setViewsButtonAddColeta] = useState(true);
	const [viewsButtonExcluir, setViewsButtonExcluir] = useState(false);
	//const [addDestinoInterme, setAddDestinoInterme] = useState(false);

	async function handleShowDetailsAboutVehicle(plate) {
		if (!plate) {
			swal("Placa inválida");
			return;
		}
		const vehicleData = (await ServiceVeiculos.detalhesImpedimentos(plate)).data
			.data;
		setVeiculo(vehicleData);
		if (!vehicleData) {
			swal("Não foi encontrado nenhum veículo com essa placa");
		}
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
				return;
			} else {
				swal("Não foi encontrado nenhum veículo com essa placa");
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
		setDebitosVeiculo(debitos);
		if (debitos.length === 0) {
			swal("Nenhum débito encontrado");
		}
	}

	const functionInputs = funcInputPontoParada(
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
	);
	return (
		<div className="class-body-form">
			<ViewsForm
				formik={formik}
				buscarCargaComDocumentoDeTransporte={
					buscarCargaComDocumentoDeTransporte
				}
				disabledFields={disabledFields}
				handleSearchVehicle={handleSearchVehicle}
				handleShowDetailsAboutVehicle={handleShowDetailsAboutVehicle}
				handleShowDebitAboutVehicle={handleShowDebitAboutVehicle}
				produtos={produtos}
				inputColeta2={inputColeta2}
				inputColeta3={inputColeta3}
				inputColeta4={inputColeta4}
				inputColeta5={inputColeta5}
				inputColeta6={inputColeta6}
				viewsButtonAddColeta={viewsButtonAddColeta}
				functionInputs={functionInputs}
				viewsButtonExcluir={viewsButtonExcluir}
				veiculo={veiculo}
				debitosVeiculo={debitosVeiculo}
				setDebitosVeiculo={setDebitosVeiculo}
				setVeiculo={setVeiculo}
			/>
		</div>
	);
}

export default FormularioCadastroCSN;
