import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, Form, InputGroup, FormControl, Modal } from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";
import Select from "react-select";

export const renderHeader = (
	formik,
	open,
	handleOpen,
	globalFilter,
	setGlobalFilter,
	motoristasAtivos
) => {
	return (
		<div className="header-table-produto">
			<Button
				onClick={handleOpen}
				style={{ backgroundColor: "#00652e", borderColor: "#00652e" }}
			>
				<MdAddCircleOutline
					style={{ marginBottom: "3px", marginRight: "3px" }}
				/>
				Adicionar
			</Button>
			<Modal show={open} onHide={handleOpen}>
				<Modal.Header closeButton>
					<Modal.Title>Adicionar Motorista ao Grupo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="validationFormikUsuario">
							<Form.Label>Motorista</Form.Label>
							<Select
								id="item"
								name="item"
								placeholder="Selecionar Usuário"
								options={motoristasAtivos}
								onChange={(option) => formik.setFieldValue("item", option)}
								value={formik.values.item}
							/>
							{formik.errors.item && formik.touched.item && (
								<div style={{ color: "red" }}>{formik.errors.item}</div>
							)}
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleOpen}>
						Fechar
					</Button>
					<Button variant="primary" onClick={formik.handleSubmit}>
						Salvar
					</Button>
				</Modal.Footer>
			</Modal>
			<div className="header-table-filter-produto">
				<InputGroup>
					<FormControl
						placeholder="Pesquisar motoristas"
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>
					<i className="pi pi-search" />
				</InputGroup>
			</div>
		</div>
	);
};

export const opcoesTemplate = (rowData, handleDelete) => {
	return (
		<div className="opcoes-table">
			<Button
				variant="outline-danger"
				onClick={(e) => {
					e.preventDefault();
					handleDelete(rowData.nome, rowData.id);
				}}
			>
				<IoIosCloseCircleOutline className="icon-des" />
				Remover
			</Button>
		</div>
	);
};

export const criadoBodyTemplate = (rowData) => {
	const [data, time] = rowData.created_at?.split("T");
	return (
		<span style={{ color: "#000" }}>{`${rowData.cod_usu_create} | ${data
			.split("-")
			.reverse()
			.join("-")} às ${time.split(".")[0]}`}</span>
	);
};

export const atualizadoBodyTemplate = (rowData) => {
	try {
		const [data, time] = rowData.updated_at?.split("T");
		return (
			<span style={{ color: "#000" }}>{`${rowData.cod_usu_update} | ${data
				.split("-")
				.reverse()
				.join("-")} às ${time.split(".")[0]}`}</span>
		);
	} catch (error) {
		return <>-</>;
	}
};
