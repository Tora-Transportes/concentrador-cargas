import React from "react";
import { Link } from "react-router-dom";
import StatusTooltip from "src/Pages/Components/StatusTooltip";
import { BsPencilSquare } from "react-icons/bs";
import CollapseHint from "../../../Components/CollapseHint";
import SelectStatusCarga from "../../../Components/SelectStatusCargas";
import InputCliente from "src/Pages/Components/InputCliente";
import { Form } from "react-bootstrap";
import ResponsavelCadastroSelect from "src/Pages/Components/ResponsavelCadastroSelect";

// function formatDate(date) {
// 	return date?.split("T")[0].split("-").reverse().join("/");
// }

function formatDateAndHour(date) {
	if (!date) return "";
	const [day, time] = date?.split("T");
	const daysFormatted = day.split("-").reverse().join("/");
	const timeFormatted = time.split(".")[0];
	return `${daysFormatted} ${timeFormatted}`;
}

export const columns = [
	{
		name: "fk_situacao",
		description: "Situação da carga",
		selector: (row) => (
			<StatusTooltip
				color={row["situacao.cor"]}
				hint={row["situacao.descricao"]}
			/>
		),
		Filter: (props) => (
			<SelectStatusCarga {...props}>
				<option></option>
			</SelectStatusCarga>
		),
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "documento_transporte",
		description: "Documento de transporte",
		selector: (row) => row.documento_transporte,
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "id",
		description: "Código da carga",
		selector: (row) => row.id,
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "editar",
		description: "Editar/Vincular",
		static_column: true,
		selector: (row) => (
			<Link to={`/cargas/csn/${row.id}`} target="_blank" rel="noopener">
				<BsPencilSquare style={{ color: "#00652E" }} size={15} />
			</Link>
		),
		sortable: "sortable",
	},
	{
		name: "cliente",
		description: "Cliente",
		selector: (row) => row.cliente.split(" -")[0],
		Filter: (props) => (
			<InputCliente label="" {...props} style={{ height: "20px" }} />
		),
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "fk_filial",
		description: "Código da filial",
		selector: (row) =>
			row.fk_filial || row["filial.descricao"]
				? `${row.fk_filial} - ${row["filial.descricao"]}`
				: row.fk_filial,
		sortable: "sortable",
		Filter: (props) => <Form.Control type="number" {...props} />,
		showFilter: true,
	},
	{
		name: "data_cadastro",
		description: "Data do cadastro",
		selector: (row) => formatDateAndHour(row.data_cadastro),
		sortable: "sortable",
		Filter: (props) => <Form.Control type="date" {...props} />,
		showFilter: true,
	},
	{
		name: "data_coleta",
		description: "Data Coleta Efetiva",
		selector: () => "Add value",
		//sortable: "sortable",
		//showFilter: true,
		//Filter: (props) => <Form.Control type="date" {...props} />,
	},
	{
		name: "data_entrega",
		description: "Data de Entrega Efetiva",
		selector: () => "Add value 2",
		//selector: (row) => formatDate(row.data_entrega),
		//sortable: "sortable",
		//showFilter: true,
		//Filter: (props) => <Form.Control type="date" {...props} />,
	},
	{
		name: "unidade_medida",
		description: "UN",
		selector: (row) => row.unidade_medida,
		sortable: "sortable",
	},
	{
		name: "quantidade",
		description: "Peso",
		selector: (row) => row.quantidade,
		sortable: "sortable",
	},
	{
		name: "responsavel_cadastro",
		description: "Responsável pelo cadastro",
		selector: (row) => row.responsavel_cadastro,
		sortable: "sortable",
		showFilter: true,
		Filter: (props) => <ResponsavelCadastroSelect {...props} />,
	},
	{
		name: "observacao",
		description: "Observações",
		selector: (row) => <CollapseHint text={row.observacao || ""} />,
		sortable: "sortable",
	},
	{
		name: "observacao_cancelamento",
		description: "Observação cancelamento",
		selector: (row) => (
			<CollapseHint text={row.observacao_cancelamento || ""} />
		),
		sortable: "sortable",
	},
];
