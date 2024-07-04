import React from "react";
import { BsPencilSquare, BsCheckLg } from "react-icons/bs";
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
									value={formik.values.nome || ""}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.nome}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.nome}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="validationFormikExigeQuantidade"
						>
							<Form.Label>Exige Quantidade</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									as="select"
									aria-describedby="inputGroupPrepend"
									name="exige_quantidade"
									value={formik.values.exige_quantidade || ""}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.exige_quantidade}
								>
									<option value="">Escolha uma opção</option>
									<option value={1}>Sim</option>
									<option value={0}>Não</option>
								</Form.Control>
								<Form.Control.Feedback type="invalid">
									{formik.errors.exige_quantidade}
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
				<FormControl
					placeholder="Pesquisar nome"
					value={globalFilter || ""} // Ensure the value is never undefined
					onChange={(e) => setGlobalFilter(e.target.value)}
				/>
				<i className="pi pi-search" />
			</div>
		</div>
	);
};

export const opcoesTemplate = (
	rowData,
	handleEditProduto,
	handleDelete,
	handleEnable
) => {
	return (
		<div className="opcoes-table">
			{rowData.ativo !== "0" ? (
				<>
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
				</>
			) : (
				<>
					<Button
						variant="outline-info"
						onClick={(e) => {
							e.preventDefault();
							handleEnable(rowData.id);
						}}
					>
						<BsCheckLg fontSize={12} />
						Ativar
					</Button>
				</>
			)}
		</div>
	);
};

export const nameBodyTemplate = (rowData) => {
	return <span style={{ color: "#000" }}>{rowData.nome}</span>;
};

export const yesOrNoBodyTemplateAT = (rowData) => {
	return (
		<span style={{ color: "#000" }}>
			{rowData.ativo == "0" ? "Não" : "Sim"}
		</span>
	);
};

export const yesOrNoBodyTemplateQT = (rowData) => {
	return (
		<span style={{ color: "#000" }}>
			{rowData.exige_quantidade == "0" ? "Não" : "Sim"}
		</span>
	);
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
