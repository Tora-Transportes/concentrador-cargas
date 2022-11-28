import React, { useEffect, useState } from "react";
import ServiceVeiculos from "src/services/ServiceVeiculos";
import swal from "sweetalert";
import "./formularioCadastroCSN.css";
import { funcInputPontoParada } from "./management";
import ViewsForm from "./ViewsForm";

function FormularioCadastroCSN({
	formik,
	produtos,
	viewsInput,
	buscarCargaComDocumentoDeTransporte,
}) {
	const [veiculo, setVeiculo] = useState(null);
	const [debitosVeiculo, setDebitosVeiculo] = useState(null);
	const [inputColeta5, setInputColeta5] = useState(false);
	const [inputColeta6, setInputColeta6] = useState(false);
	const [inputColeta7, setInputColeta7] = useState(false);
	const [inputColeta8, setInputColeta8] = useState(false);
	const [inputColeta9, setInputColeta9] = useState(false);
	const [inputColeta10, setInputColeta10] = useState(false);
	const [inputColeta11, setInputColeta11] = useState(false);
	const [inputColeta12, setInputColeta12] = useState(false);
	const [countInput, setCountInput] = useState(3);
	const [viewsButtonAddColeta, setViewsButtonAddColeta] = useState(true);
	const [viewsButtonExcluir, setViewsButtonExcluir] = useState(false);

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
		setInputColeta5,
		setInputColeta6,
		setInputColeta7,
		setInputColeta8,
		setInputColeta9,
		setInputColeta10,
		setInputColeta11,
		setInputColeta12
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
				inputColeta11={inputColeta11}
				inputColeta12={inputColeta12}
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
