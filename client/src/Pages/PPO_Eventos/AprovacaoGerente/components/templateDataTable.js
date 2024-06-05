import React from "react";
import { BsCheckCircleFill, BsEyeFill, BsInfoCircle } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import swal from "sweetalert";

export const renderHeader = (globalFilter, setGlobalFilter) => {
	return (
		<div className="header-table-produto">
			<div className="header-table-filter-produto">
				<InputGroup>
					<FormControl
						placeholder="Pesquisar Nome"
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>
					<i className="pi pi-search" />
				</InputGroup>
			</div>
		</div>
	);
};

export const opcoesTemplate = (rowData, handleAprove, handleReject) => {
	return (
		<div className="opcoes-table">
			<Button
				variant="outline-success"
				onClick={(e) => {
					e.preventDefault();
					handleAprove(rowData);
				}}
			>
				<BsCheckCircleFill className="icon-editar" />
				Aprovar
			</Button>
			<Button
				variant="outline-danger"
				onClick={(e) => {
					e.preventDefault();
					handleReject(rowData);
				}}
			>
				<IoIosCloseCircleOutline className="icon-des" />
				Rejeitar
			</Button>
		</div>
	);
};

export const nameBodyTemplate = (rowData) => {
	return <span style={{ color: "#000" }}>{rowData.nome}</span>;
};

export const horasBodyTemplate = (rowData) => {
	return <span style={{ color: "#000" }}>{rowData.horas} horas</span>;
};

export const statusBodyTemplate = (rowData) => {
	const status = [
		"Aguardando aprovação supervisor",
		"Aprovado Supervisor aguardando Gerente",
		"Aprovado Supervisor e Gerente",
		"Reprovado pelo Supervisor",
		"Reprovado pelo Gerente",
	];
	return (
		<span style={{ color: "#000" }}>{status[rowData.status_aprovacao]}</span>
	);
};

export const observacaoSup = (rowData) => {
	return (
		<Button
			variant="outline-warning"
			onClick={(e) => {
				e.preventDefault();
				swal(rowData.obs_supervisor);
			}}
		>
			<BsEyeFill className="icon-info" />
			Observação
		</Button>
	);
};

export const criadoBodyTemplate = (rowData) => {
	const [data, time] = rowData.created_at?.split("T");
	const info = `${rowData.cod_usu_create} | ${data
		.split("-")
		.reverse()
		.join("-")} às ${time.split(".")[0]}`;
	return (
		<Button
			variant="outline-primary"
			onClick={(e) => {
				e.preventDefault();
				swal(info);
			}}
		>
			<BsInfoCircle className="icon-info" />
			Info
		</Button>
	);
};

export const atualzadoBodyTemplate = (rowData) => {
	const [data, time] = rowData.updated_at?.split("T");
	const info = `${rowData.cod_usu_update} | ${data
		.split("-")
		.reverse()
		.join("-")} às ${time.split(".")[0]}`;
	return (
		<Button
			variant="outline-primary"
			onClick={(e) => {
				e.preventDefault();
				swal(info);
			}}
		>
			<BsInfoCircle className="icon-info" />
			Info
		</Button>
	);
};
