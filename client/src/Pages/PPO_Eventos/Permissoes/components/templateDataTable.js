import React from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, InputGroup, Form, FormControl, Modal } from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";
import Select from "react-select";

export const renderHeader = (
	users,
	permissoes,
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
							<Form.Group
								className="mb-3"
								controlId="validationFormikPermissao"
							>
								<Form.Label>Permissão</Form.Label>
								<Select
									id="permissao"
									name="permissao"
									placeholder="Selecionar Permissão"
									options={permissoes}
									onChange={(option) =>
										formik.setFieldValue("permissao", option)
									}
									value={formik.values.permissao}
								/>
								{formik.errors.permissao && formik.touched.permissao && (
									<div style={{ color: "red" }}>{formik.errors.permissao}</div>
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

export const permissaoBodyTemplate = (rowData) => {
	if (rowData.permissao == 0) {
		return <span style={{ color: "#000" }}>Supervisor</span>;
	} else {
		return <span style={{ color: "#000" }}>Gerente/Diretor</span>;
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
