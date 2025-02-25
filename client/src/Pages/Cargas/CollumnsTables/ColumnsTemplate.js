import React from "react";
import { Link } from "react-router-dom";
import StatusTooltip from "src/Pages/Components/StatusTooltip";
import { BsPencilSquare } from "react-icons/bs";
import CollapseHint from "../../Components/CollapseHint";
import SelectStatusCarga from "../../Components/SelectStatusCargas";
import InputCliente from "src/Pages/Components/InputCliente";
import { Form } from "react-bootstrap";
import ResponsavelCadastroSelect from "src/Pages/Components/ResponsavelCadastroSelect";
import { Chip } from "@material-ui/core";

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
		name: "placa_veiculo",
		description: "Placa Veículo",
		selector: (row) => row.placa_veiculo ?? "Sem placa",
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "placa_carreta",
		description: "Placa Carreta",
		selector: (row) => row.placa_carreta ?? "Sem placa",
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
		name: "carga_filha",
		description: "Tipo",
		selector: (row) => (
			<>
				<Chip
					label={
						row.carga_filha === 1
							? `Carga Vinculada á ${row.carga_mae_id}`
							: row.estilo_carga === 2
							? "Base"
							: "Normal"
					}
					color="primary"
				></Chip>
			</>
		),
		showFilter: false,
	},
	{
		name: "editar",
		description: "Editar/Vincular",
		static_column: true,
		selector: (row) => (
			<Link
				to={`/cargas/${
					row.canal_comunicacao === "portal" ? "manual" : "manual"
				}/${row.id}`}
				target="_blank"
				rel="noopener"
			>
				<BsPencilSquare style={{ color: "#00652E" }} size={15} />
			</Link>
		),
		sortable: "sortable",
	},
	{
		name: "estilo_carga",
		description: "Estilo da Carga",
		selector: (row) => (
			<>
				<Chip
					label={row.estilo_carga === 2 ? "Base" : "Normal"}
					color="primary"
				></Chip>
			</>
		),
		Filter: (props) => (
			<Form.Select {...props}>
				<option></option>
				<option value="2"> Base </option>
				<option value="1"> Normal </option>
			</Form.Select>
		),
		showFilter: true,
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
		name: "carga_app",
		description: "Cargas enviadas App",
		selector: (row) => (row.carga_app === 1 ? "Sim" : "Não"),
		Filter: (props) => (
			<Form.Select {...props}>
				<option></option>
				<option value="1"> Sim </option>
				<option value="0"> Não </option>
			</Form.Select>
		),
		showFilter: true,
	},
	{
		name: "origem_carga",
		description: "Origem",
		selector: (row) => row.origem_carga,
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "destino_carga",
		description: "Destino",
		selector: (row) => row.destino_carga,
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "data_coleta",
		description: "Data de coleta",
		selector: (row) => formatDate(row.data_coleta),
		sortable: "sortable",
		showFilter: true,
		Filter: (props) => <Form.Control type="date" {...props} />,
	},
	{
		name: "data_entrega",
		description: "Data de entrega",
		selector: (row) => formatDate(row.data_entrega),
		sortable: "sortable",
		showFilter: true,
		Filter: (props) => <Form.Control type="date" {...props} />,
	},
	{
		name: "tipo_carga",
		description: "Tipo de carga",
		selector: (row) => row.tipo_carga,
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "canal_comunicacao",
		description: "Canal de comunicação",
		selector: (row) => row.canal_comunicacao,
		sortable: "sortable",
	},
	{
		name: "unidade_medida",
		description: "UN",
		selector: (row) => row.unidade_medida,
		sortable: "sortable",
	},
	{
		name: "quantidade",
		description: "Quantidade",
		selector: (row) => row.quantidade,
		sortable: "sortable",
	},
	{
		name: "responsavel_cadastro",
		description: "Responsável pelo cadastro",
		selector: (row) => row.responsavel_cadastro,
		sortable: "sortable",
		showFilter: true,
		Filter: (props) => <ResponsavelCadastroSelect user="padrao" {...props} />,
	},

	{
		name: "janela_coleta",
		description: "Janela de coleta",
		selector: (row) => row.janela_coleta || "",
		sortable: "sortable",
	},
	{
		name: "janela_entrega",
		description: "Janela de entrega",
		selector: (row) => row.janela_entrega || "",
		sortable: "sortable",
	},
	{
		name: "acessorios_requisitos",
		description: "Acessórios e requisitos",
		selector: (row) => <CollapseHint text={row.acessorios_requisitos || ""} />,
		sortable: "sortable",
	},
	{
		name: "informacoes_restritivas",
		description: "Informações restritivas",
		selector: (row) => (
			<CollapseHint text={row.informacoes_restritivas || ""} />
		),
		sortable: "sortable",
	},

	{
		name: "observacao",
		description: "Observações",
		selector: (row) => <CollapseHint text={row.observacao || ""} />,
		sortable: "sortable",
	},
	{
		name: "data_atualizacao",
		description: "Data da última atualização",
		selector: (row) => formatDateAndHour(row.data_atualizacao),
		sortable: "sortable",
	},
	{
		name: "fk_lote_pai",
		description: "Lote de origem",
		selector: (row) => row.fk_lote_pai,
		Filter: () => null,
		sortable: "sortable",
	},
	{
		name: "observacao_gr",
		description: "Observação do GR",
		selector: (row) => <CollapseHint text={row.observacao_gr || ""} />,
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
	{
		name: "usuario",
		description: "Responsável pela última alteração",
		selector: (row) => <CollapseHint text={row.usuario || ""} />,
		sortable: "sortable",
	},
];
