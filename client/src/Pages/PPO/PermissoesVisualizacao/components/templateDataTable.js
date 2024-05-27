import React from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, InputGroup, Form, FormControl, Modal } from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

export const renderHeader = (
	users,
	grupos,
	formik,
	globalFilter,
	setGlobalFilter,
	open,
	handleOpen
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
				Adicionar Usuário
			</Button>
			<Modal show={open} onHide={handleOpen}>
				<Modal.Header closeButton>
					<Modal.Title>Adicionar Usuário</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Modal.Body>
						<Form>
							<Form.Group className="mb-3" controlId="validationFormikUsuario">
								<Form.Label>Usuário</Form.Label>
								<Select
									id="users"
									name="users"
									placeholder="Selecionar Usuário"
									options={users}
									onChange={(option) => formik.setFieldValue("users", option)}
									value={formik.values.users}
								/>
								{formik.errors.users && formik.touched.users && (
									<div style={{ color: "red" }}>{formik.errors.users}</div>
								)}
							</Form.Group>
							<Form.Group className="mb-3" controlId="validationFormikGrupos">
								<Form.Label>Grupos</Form.Label>
								<Select
									id="grupos"
									name="grupos"
									isMulti
									placeholder="Selecionar Grupos"
									options={grupos}
									components={animatedComponents}
									onChange={(option) => formik.setFieldValue("grupos", option)}
									value={formik.values.grupos}
								/>
								{formik.errors.grupos && formik.touched.grupos && (
									<div style={{ color: "red" }}>{formik.errors.grupos}</div>
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
				</Modal.Body>
			</Modal>
			<div className="header-table-filter-produto">
				<InputGroup>
					<FormControl
						placeholder="Pesquisar Usuário"
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>
					<i className="pi pi-search" />
				</InputGroup>
			</div>
		</div>
	);
};

export const opcoesTemplate = (
	rowData,
	swal,
	handleEditProduto,
	handleDelete
) => {
	return (
		<div className="opcoes-table">
			<Button
				variant="outline-warning"
				onClick={(e) => {
					e.preventDefault();
					handleEditProduto(rowData);
				}}
			>
				<BsPencilSquare className="icon-editar" />
				Editar
			</Button>
			<Button
				variant="outline-danger"
				onClick={(e) => {
					e.preventDefault();
					handleDelete(rowData);
				}}
			>
				<IoIosCloseCircleOutline className="icon-des" />
				Deletar
			</Button>
		</div>
	);
};

export const nameBodyTemplate = (rowData) => {
	return <span style={{ color: "#000" }}>{rowData.nome}</span>;
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
