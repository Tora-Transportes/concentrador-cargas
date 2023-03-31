import React, { useState, useRef, useEffect } from "react";
import "./localizacao.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { BsPencilSquare } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import TableLocalizacao from "./Tabela";
import ServiceCsnCargas from "src/services/ServiceCsnCargas";
let emptyLocation = {
	ID: null,
	DESCRICAO: "",
	LATITUDE: "",
	LONGITUDE: "",
	RAIO: "",
};

const ViewsLocalizacao = ({ dadosLocalizacao, setAtualizarTabela }) => {
	const [valueLocalizacao, setValueLocalizacao] = useState(null);
	const [locationDialog, setLocationDialog] = useState(false);
	const [deleteLocationDialog, setDeleteLocationDialog] = useState(false);

	const [location, setLocation] = useState(emptyLocation);
	const [submitted, setSubmitted] = useState(false);
	const [globalFilter, setGlobalFilter] = useState(null);
	const [titleDialog, serTitleDialog] = useState();
	const toast = useRef(null);

	useEffect(() => {
		(async () => {
			setValueLocalizacao(await dadosLocalizacao);
		})();
	}, [dadosLocalizacao]);

	const openNew = () => {
		setLocation(emptyLocation);
		setSubmitted(false);
		setLocationDialog(true);
		serTitleDialog("Cadastrar Localização");
	};

	const editLocation = (location) => {
		const { LATITUDE, LONGITUDE, RAIO } = location;
		location.LATITUDE = Number(LATITUDE.replace(",", "."));
		location.LONGITUDE = Number(LONGITUDE.replace(",", "."));
		location.RAIO = Number(RAIO);
		setLocation({ ...location });
		setLocationDialog(true);
		serTitleDialog("Editar Localização");
	};

	const hideDialog = () => {
		setSubmitted(false);
		setLocationDialog(false);
	};

	const hideDeleteLocationDialog = () => {
		setDeleteLocationDialog(false);
	};

	const saveLocation = async () => {
		setSubmitted(true);
		if (
			location.DESCRICAO?.length &&
			location.LATITUDE &&
			location.LONGITUDE &&
			location.RAIO
		) {
			const bodyRota = {
				DESCRICAO: location.DESCRICAO,
				LATITUDE: location.LATITUDE,
				LONGITUDE: location.LONGITUDE,
				RAIO: location.RAIO,
			};

			if (location.ID) {
				// Atualização das rotas.
				try {
					const id = location.ID;
					await ServiceCsnCargas.update(id, bodyRota);
					toast.current.show({
						severity: "success",
						summary: "Sucesso!",
						detail: "Rota atualizada com sucesso.",
						life: 3000,
					});

					setAtualizarTabela(true);
				} catch (error) {
					console.error(error);
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}
			} else {
				// salvar rotas.
				try {
					await ServiceCsnCargas.create(bodyRota);
					toast.current.show({
						severity: "success",
						summary: "Sucesso !",
						detail: "Rota criado com sucesso.",
						life: 3000,
					});
					setAtualizarTabela(true);
				} catch (error) {
					console.error(error);
				}
			}

			//setValueLocalizacao(_locations);
			setLocationDialog(false);
			setLocation(emptyLocation);
		}
	};

	const confirmDeleteLocation = (location) => {
		setLocation(location);
		setDeleteLocationDialog(true);
	};

	const deleteLocation = async () => {
		//Adicionar codigo de Deleção
		try {
			const result = await ServiceCsnCargas.delete(location.ID);
			if (result.status === 204) {
				setDeleteLocationDialog(false);
				toast.current.show({
					severity: "info",
					summary: "OPS!",
					detail:
						"Esta rota não pode ser deletada, existe uma carga atrelada a ela.",
					life: 3000,
				});
			} else {
				setDeleteLocationDialog(false);
				setLocation(emptyLocation);
				toast.current.show({
					severity: "success",
					summary: "Sucesso",
					detail: "Rota deletada com sucesso.",
					life: 3000,
				});
				setAtualizarTabela(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const onInputChange = (e, name) => {
		const valuesField = e.target.value?.toUpperCase();
		name === "DESCRICAO" ? (e.target && e.target.value) || "" : e.value || 0;
		let _location = { ...location };
		_location[`${name}`] = valuesField;

		setLocation(_location);
	};

	const actionBodyTemplate = (rowData) => {
		return (
			<div>
				<Button
					icon={<BsPencilSquare size={20} />}
					className="p-button-rounded p-button-success ms-2"
					onClick={() => editLocation(rowData)}
				/>
				<Button
					icon={<MdDeleteForever size={22} />}
					className="p-button-rounded p-button-danger ms-2 "
					onClick={() => confirmDeleteLocation(rowData)}
				/>
			</div>
		);
	};

	const headerTable = (
		<div className="table-header">
			<div className="mx-0 my-1 header-table-div">
				<Button
					label="Adicionar Rota"
					icon="pi pi-plus"
					className="p-button-success mr-2 "
					onClick={openNew}
				/>
			</div>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText
					type="search"
					onInput={(e) => setGlobalFilter(e.target.value)}
					placeholder="Pesquisar..."
				/>
			</span>
		</div>
	);
	const locationDialogFooter = (
		<div>
			<Button
				label="Cancelar"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideDialog}
			/>
			<Button
				label="Salvar"
				icon="pi pi-check"
				className="p-button-text"
				onClick={saveLocation}
			/>
		</div>
	);
	const deleteLocationDialogFooter = (
		<div>
			<Button
				label="Voltar"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideDeleteLocationDialog}
			/>
			<Button
				label="Sim"
				icon="pi pi-check"
				className="p-button-text"
				onClick={deleteLocation}
			/>
		</div>
	);

	return (
		<>
			<Menusuperior />
			<Container>
				<Row className="mt-3 text-center">
					<Col>
						<h1 className="title-gerenciamento-CSN">
							Gerenciamento de Rotas - CSN
						</h1>
					</Col>
					<div className="datatable-crud-demo">
						<Toast ref={toast} />

						<TableLocalizacao
							valueLocalizacao={valueLocalizacao}
							globalFilter={globalFilter}
							header={headerTable}
							actionBodyTemplate={actionBodyTemplate}
						/>

						<Dialog
							visible={locationDialog}
							style={{ width: "450px" }}
							header={titleDialog}
							modal
							className="p-fluid"
							footer={locationDialogFooter}
							onHide={hideDialog}
						>
							<div className="field">
								<label htmlFor="DESCRICAO">Descrição</label>
								<InputTextarea
									id="DESCRICAO"
									value={location.DESCRICAO}
									onChange={(e) => onInputChange(e, "DESCRICAO")}
									required
									rows={3}
									cols={20}
									autoFocus
									className={classNames({
										"p-invalid": submitted && !location.DESCRICAO,
									})}
								/>
								{submitted && !location.DESCRICAO && (
									<small className="p-error">
										Descrição é um campo obrigatório.
									</small>
								)}
							</div>

							<div className="formgrid grid">
								<label htmlFor="L">Latitude</label>
								<div className="field col">
									<Form.Control
										type="number"
										min={1}
										step={0.01}
										placeholder=" "
										name="LATITUDE"
										value={location.LATITUDE}
										onChange={(e) => onInputChange(e, "LATITUDE")}
										className={classNames({
											"p-invalid": submitted && !location.LATITUDE,
										})}
										required
									/>
									{submitted && !location.LATITUDE && (
										<small className="p-error">
											Latititude é um campo obrigatório.
										</small>
									)}
								</div>
								<div className="field col">
									<label htmlFor="LONGITUDE">Longitude</label>
									<Form.Control
										type="number"
										min={1}
										step={0.01}
										placeholder=" "
										name="LONGITUDE"
										value={location.LONGITUDE}
										onChange={(e) => onInputChange(e, "LONGITUDE")}
										className={classNames({
											"p-invalid": submitted && !location.LONGITUDE,
										})}
										required
									/>
									{submitted && !location.LONGITUDE && (
										<small className="p-error">
											Longitude é um campo obrigatório.
										</small>
									)}
								</div>
								<div className="field col">
									<label htmlFor="RAIO">Raio(KM)</label>
									<Form.Control
										type="number"
										min={1}
										step={0.0}
										placeholder=" "
										name="RAIO"
										value={location.RAIO}
										onChange={(e) => onInputChange(e, "RAIO")}
										className={classNames({
											"p-invalid": submitted && !location.RAIO,
										})}
										required
									/>
									{submitted && !location.RAIO && (
										<small className="p-error">
											Raio é um campo obrigatório.
										</small>
									)}
								</div>
							</div>
						</Dialog>

						<Dialog
							visible={deleteLocationDialog}
							style={{ width: "450px" }}
							header="Deletar Rota"
							modal
							footer={deleteLocationDialogFooter}
							onHide={hideDeleteLocationDialog}
						>
							<i
								className="pi pi-exclamation-triangle"
								style={{ fontSize: "2rem", marginLeft: "42%" }}
							/>
							<div className="confirmation-content">
								{location && (
									<span className="span-delete">
										Essa ação irá deletar os dados da rota selecionada.{" "}
										<b className="span-b-delete">Deseja continuar?</b>
									</span>
								)}
							</div>
						</Dialog>
					</div>
				</Row>
			</Container>
		</>
	);
};

export default ViewsLocalizacao;
