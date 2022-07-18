import React from "react";
import { Link } from "react-router-dom";
import StatusTooltip from "src/Pages/Components/StatusTooltip";
import { BsPencilSquare } from "react-icons/bs";
import CollapseHint from "../../Components/CollapseHint";
import SelectStatusCarga from "../../Components/SelectStatusCargas";
import InputCliente from "src/Pages/Components/InputCliente";
import { Form } from "react-bootstrap";
import ResponsavelCadastroSelect from "src/Pages/Components/ResponsavelCadastroSelect";

function formatDate(date) {
	return date?.split("T")[0].split("-").reverse().join("/");
}

function formatDateAndHour(date) {
	if (!date) return "";
	const [day, time] = date?.split("T");
	const daysFormatted = day.split("-").reverse().join("/");
	const timeFormatted = time.split(".")[0];
	return `${daysFormatted} ${timeFormatted}`;
}

export const columns = [
	{
		field: "fk_situacao",
		header: "Situação",
		body: (row) => (
			<StatusTooltip
				color={row["situacao.cor"]}
				hint={row["situacao.descricao"]}
			/>
		),
		filterElement: (props) => (
			<SelectStatusCarga {...props}>
				<option></option>
			</SelectStatusCarga>
		),
		sortable: "sortable",
	},
	{
		field: "id",
		header: "Código da Carga",
		body: (row) => row.id,
		sortable: "sortable",
	},
	{
		field: "fk_filial",
		header: "Código da filial",
		body: (row) =>
			row.fk_filial || row["filial.descricao"]
				? `${row.fk_filial} - ${row["filial.descricao"]}`
				: row.fk_filial,
		sortable: "sortable",
		filterElement: (props) => <Form.Control type="number" {...props} />,
	},
	{
		field: "cliente",
		header: "Cliente",
		body: (row) => row.cliente.split(" -")[0],
		filterElement: (props) => <InputCliente label="" {...props} />,
		sortable: "sortable",
	},
	{
		field: "origem_carga",
		header: "Origem",
		body: (row) => row.origem_carga,
		sortable: "sortable",
	},
	{
		field: "destino_carga",
		header: "Destino",
		body: (row) => row.destino_carga,
		sortable: "sortable",
	},
	{
		field: "data_coleta",
		header: "Data coleta",
		body: (row) => formatDate(row.data_coleta),
		sortable: "sortable",
		filterElement: (props) => <Form.Control type="date" {...props} />,
	},
	{
		field: "data_entrega",
		header: "Data Entrega",
		body: (row) => formatDate(row.data_entrega),
		sortable: "sortable",
		filterElement: (props) => <Form.Control type="date" {...props} />,
	},
	{
		field: "data_cadastro",
		header: "Data Cadastro",
		body: (row) => formatDateAndHour(row.data_cadastro),
		sortable: "sortable",
		filterElement: (props) => <Form.Control type="date" {...props} />,
	},
	{
		field: "tipo_carga",
		header: "Tipo Carga",
		body: (row) => row.tipo_carga,
		sortable: "sortable",
	},
	{
		field: "canal_comunicacao",
		header: "Canal comunicação",
		body: (row) => row.canal_comunicacao,
		sortable: "sortable",
	},
	{
		field: "unidade_medida",
		header: "UN",
		body: (row) => row.unidade_medida,
		sortable: "sortable",
	},
	{
		field: "quantidade",
		header: "Quantidade",
		body: (row) => row.quantidade,
		sortable: "sortable",
	},
	{
		field: "responsavel_cadastro",
		header: "Responsável Cadastro",
		body: (row) => row.responsavel_cadastro,
		sortable: "sortable",
		filterElement: (props) => <ResponsavelCadastroSelect {...props} />,
	},

	{
		field: "janela_coleta",
		header: "Janela de coleta",
		body: (row) => row.janela_coleta || "",
		sortable: "sortable",
	},
	{
		field: "janela_entrega",
		header: "Janela de entrega",
		body: (row) => row.janela_entrega || "",
		sortable: "sortable",
	},
	{
		field: "acessorios_requisitos",
		header: "Acessórios e requisitos",
		body: (row) => <CollapseHint text={row.acessorios_requisitos || ""} />,
		sortable: "sortable",
	},
	{
		field: "informacoes_restritivas",
		header: "Informações restritivas",
		body: (row) => <CollapseHint text={row.informacoes_restritivas || ""} />,
		sortable: "sortable",
	},

	{
		field: "observacao",
		header: "Observações",
		body: (row) => <CollapseHint text={row.observacao || ""} />,
		sortable: "sortable",
	},
	{
		field: "data_atualizacao",
		header: "Data última atualização",
		body: (row) => formatDateAndHour(row.data_atualizacao),
		sortable: "sortable",
	},
	{
		field: "fk_lote_pai",
		header: "Lote origem",
		body: (row) => row.fk_lote_pai,
		Filter: () => null,
		sortable: "sortable",
	},
	{
		field: "documento_transporte",
		header: "Documento de transporte",
		body: (row) => row.documento_transporte,
		sortable: "sortable",
	},
	{
		field: "editar",
		header: "Editar/Vincular",
		static_column: true,
		body: (row) => (
			<Link
				to={`/cargas/${
					row.canal_comunicacao === "portal" ? "manual" : "manual"
				}/${row.id}`}
				target="_blank"
				rel="noopener"
			>
				<BsPencilSquare />
			</Link>
		),
		sortable: "sortable",
	},
	{
		field: "observacao_gr",
		header: "Observação do GR",
		body: (row) => <CollapseHint text={row.observacao_gr || ""} />,
		sortable: "sortable",
	},
	{
		field: "observacao_cancelamento",
		header: "Observação cancelamento",
		body: (row) => <CollapseHint text={row.observacao_cancelamento || ""} />,
		sortable: "sortable",
	},
	{
		field: "usuario",
		header: "Responsável última alteração",
		body: (row) => <CollapseHint text={row.usuario || ""} />,
		sortable: "sortable",
	},
];
