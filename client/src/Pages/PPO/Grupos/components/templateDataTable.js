import React from "react";
import { BsPencilSquare } from "react-icons/bs";
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
							placeholder="Adicionar grupo"
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
						placeholder="Pesquisar grupo"
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
