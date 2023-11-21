import React from "react";
import { BsCheckLg, BsInfoCircle, BsPencilSquare } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";

export const renderHeader = (formik, globalFilter, setGlobalFilter) => {
	return (
		<div className="header-table-produto">
			<div className="header-input-save">
				<Form onSubmit={formik.handleSubmit}>
					<InputGroup>
						<button type="submit" className="button-header-save">
							<MdAddCircleOutline className="header-table-icon-button" />
						</button>
						<FormControl
							placeholder="Adicionar parâmetro"
							name="nome"
							onChange={formik.handleChange}
							value={formik.values.nome.toUpperCase()}
						/>
					</InputGroup>
				</Form>
			</div>
			<div className="header-table-filter-produto">
				<InputGroup>
					<FormControl
						placeholder="Pesquisar parâmetros"
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
	handleDelete,
	handleEnableProduto
) => {
	return (
		<div className="opcoes-table">
			{rowData.ativo !== 0 ? (
				<>
					<Button
						variant="outline-warning"
						onClick={(e) => {
							e.preventDefault();
							handleEditProduto(rowData.nome, rowData.id);
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
						Desativar
					</Button>
				</>
			) : (
				<>
					<Button
						variant="outline-info"
						onClick={(e) => {
							e.preventDefault();
							handleEnableProduto(rowData.id);
						}}
					>
						<BsCheckLg fontSize={12} />
						Ativar
					</Button>
					<Button
						variant="outline-primary"
						onClick={(e) => {
							e.preventDefault();
							swal(rowData.observacao);
						}}
					>
						<BsInfoCircle className="icon-info" />
						Info
					</Button>
				</>
			)}
		</div>
	);
};

export const situacaoBodyTemplate = (rowData) => {
	let colorSpan = "#000";
	let situacao = "Ativo";
	if (rowData.ativo !== 1) {
		situacao = "Inativo";
		colorSpan = "red";
	}
	return (
		<React.Fragment>
			<span style={{ color: colorSpan }}>{situacao}</span>
		</React.Fragment>
	);
};

export const nameBodyTemplate = (rowData) => {
	const colorSpan = rowData.ativo !== 1 ? "red" : "#000";
	return <span style={{ color: colorSpan }}>{rowData.nome}</span>;
};
export const usuarioBodyTemplate = (rowData) => {
	const colorSpan = rowData.ativo !== 1 ? "red" : "#000";
	return <span style={{ color: colorSpan }}>{rowData.usuario}</span>;
};
