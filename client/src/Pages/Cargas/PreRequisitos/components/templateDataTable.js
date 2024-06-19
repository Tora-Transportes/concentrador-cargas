import React from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, Form, InputGroup, FormControl, Modal } from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";

export const renderHeader = (
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
				Adicionar
			</Button>
			<Modal show={open} onHide={handleOpen}>
				<Modal.Header closeButton>
					<Modal.Title>Adicionar pré-requisito</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="validationFormikNome">
							<Form.Label>Nome</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Nome"
									aria-describedby="inputGroupPrepend"
									name="nome"
									value={formik.values.nome}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.nome}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.nome}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group className="mb-3" controlId="validationFormikEmpresa">
							<Form.Label>Empresa</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Empresa"
									aria-describedby="inputGroupPrepend"
									name="empresa"
									value={formik.values.empresa}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.empresa}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.empresa}
								</Form.Control.Feedback>
							</InputGroup>
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
						placeholder="Pesquisar nome"
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>
					<i className="pi pi-search" />
				</InputGroup>
			</div>
		</div>
	);
};

export const opcoesTemplate = (rowData, handleEditProduto, handleDelete) => {
	return (
		<div className="opcoes-table">
			<Button
				variant="outline-warning"
				onClick={(e) => {
					e.preventDefault();
					handleEditProduto(rowData, rowData.id);
				}}
			>
				<BsPencilSquare className="icon-editar" />
				Editar
			</Button>
			<Button
				variant="outline-danger"
				onClick={(e) => {
					e.preventDefault();
					handleDelete(rowData.nome, rowData.id);
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
export const usuarioBodyTemplate = (rowData) => {
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

export const criadoBodyTemplate = (rowData) => {
	const [data, time] = rowData.created_at?.split("T");
	return (
		<span style={{ color: "#000" }}>{`${rowData.cod_usu_create} | ${data
			.split("-")
			.reverse()
			.join("-")} às ${time.split(".")[0]}`}</span>
	);
};
