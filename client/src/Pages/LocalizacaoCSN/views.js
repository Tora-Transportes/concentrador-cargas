import React, { useState, useRef, useEffect } from "react";
import "./localizacao.css";
import { Container, Row, Col } from "react-bootstrap";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { BsPencilSquare } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import TableLocalizacao from "./Tabela";
let emptyLocation = {
	id: null,
	description: "",
	lat: 0,
	lot: 0,
};

const ViewsLocalizacao = ({ dadosLocalizacao }) => {
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

	const saveLocation = () => {
		setSubmitted(true);
		if (location.description?.length && location.lat && location.lot) {
			let _locations = [...valueLocalizacao];
			let _location = { ...location };
			if (location.id) {
				// parte do codigo onde sera atualizado a localização.
				const index = findIndexById(location.id);

				_locations[index] = _location;
				toast.current.show({
					severity: "success",
					summary: "Successful",
					detail: "Rota atualizada com sucesso.",
					life: 3000,
				});
			} else {
				// parte do codigo onde sera add o salvamento da localização
				_location.id = createId();
				_locations.push(_location);
				toast.current.show({
					severity: "success",
					summary: "OK !",
					detail: "Rota criado com sucesso.",
					life: 3000,
				});
			}

			setValueLocalizacao(_locations);
			setLocationDialog(false);
			setLocation(emptyLocation);
		}
	};

	const confirmDeleteLocation = (location) => {
		setLocation(location);
		setDeleteLocationDialog(true);
	};

	const deleteLocation = () => {
		//Adicionar codigo de Deleção
		let _locations = valueLocalizacao.filter((val) => val.id !== location.id);
		setValueLocalizacao(_locations);
		setDeleteLocationDialog(false);
		setLocation(emptyLocation);
		toast.current.show({
			severity: "success",
			summary: "Successful",
			detail: "Localização deletada com sucesso.",
			life: 3000,
		});
	};

	const findIndexById = (id) => {
		let index = -1;
		for (let i = 0; i < valueLocalizacao.length; i++) {
			if (valueLocalizacao[i].id === id) {
				index = i;
				break;
			}
		}

		return index;
	};

	const createId = () => {
		let id = "";
		let chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < 5; i++) {
			id += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return id;
	};

	const onInputChange = (e, name) => {
		const valuesField =
			name === "description"
				? (e.target && e.target.value) || ""
				: e.value || 0;
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
						<h1 className="title">Gerenciamento de Rotas - CSN</h1>
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
								<label htmlFor="description">Descrição</label>
								<InputTextarea
									id="description"
									value={location.description}
									onChange={(e) => onInputChange(e, "description")}
									required
									rows={3}
									cols={20}
									autoFocus
									className={classNames({
										"p-invalid": submitted && !location.description,
									})}
								/>
								{submitted && !location.description && (
									<small className="p-error">
										Descrição é um campo obrigatório.
									</small>
								)}
							</div>

							<div className="formgrid grid">
								<div className="field col">
									<label htmlFor="lat">Latititude</label>

									<InputNumber
										inputId="lat"
										value={parseFloat(location?.lat)}
										onChange={(e) => onInputChange(e, "lat")}
										required
										autoFocus
										//mode="decimal"
										useGrouping={false}
										className={classNames({
											"p-invalid": submitted && !location.lat,
										})}
									/>
									{submitted && !location.lat && (
										<small className="p-error">
											Latititude é um campo obrigatório.
										</small>
									)}
								</div>
								<div className="field col">
									<label htmlFor="lot">Longitude</label>
									<InputNumber
										inputId="lot"
										value={parseFloat(location.lot)}
										onChange={(e) => onInputChange(e, "lot")}
										required
										autoFocus
										useGrouping={false}
										//mode="decimal"
										className={classNames({
											"p-invalid": submitted && !location.lot,
										})}
									/>
									{submitted && !location.lot && (
										<small className="p-error">
											Longitude é um campo obrigatório.
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
							<div className="confirmation-content">
								<i
									className="pi pi-exclamation-triangle mr-2"
									style={{ fontSize: "2rem" }}
								/>
								{location && (
									<span>
										{" "}
										Deseja deletar a rota de <b>{location.description}</b>?
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
