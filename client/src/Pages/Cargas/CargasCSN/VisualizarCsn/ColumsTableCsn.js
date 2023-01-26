import React from "react";
import { Link } from "react-router-dom";
import StatusTooltip from "src/Pages/Components/StatusTooltip";
import { BsPencilSquare } from "react-icons/bs";
import { FaRegEyeSlash, FaMapMarkedAlt } from "react-icons/fa";
import CollapseHint from "../../../Components/CollapseHint";
import SelectStatusCarga from "../../../Components/SelectStatusCargas";
import InputCliente from "src/Pages/Components/InputCliente";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import ResponsavelCadastroSelect from "src/Pages/Components/ResponsavelCadastroSelect";
import DateUtils from "../../../Utils/date";

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
		Filter: (props) => {
			const csn = 1;
			return (
				<SelectStatusCarga {...props} csn={csn}>
					<option></option>
				</SelectStatusCarga>
			);
		},
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
		name: "placa_veiculo",
		description: "Placa Veículo",
		selector: (row) => row.placa_veiculo,
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "placa_carreta",
		description: "Placa carreta",
		selector: (row) => row.placa_carreta,
		sortable: "sortable",
		showFilter: true,
	},
	{
		name: "rastreador",
		description: "Rastreador",
		selector: (row) => {
			const dadosRastreador =
				row.rastreador === "Sem rastreador" || row.rastreador === null
					? false
					: true;
			return dadosRastreador ? (
				<OverlayTrigger
					placement="left"
					overlay={<Tooltip>{row.rastreador}</Tooltip>}
				>
					<div>{<FaMapMarkedAlt size={16} color={"#363636"} />}</div>
				</OverlayTrigger>
			) : (
				<OverlayTrigger
					placement="left"
					overlay={<Tooltip>{"Sem rastreador"}</Tooltip>}
				>
					<div>
						<FaRegEyeSlash size={16} color={"#1C1C1C"} />
					</div>
				</OverlayTrigger>
			);
		},
		Filter: (props) => (
			<Form.Select {...props}>
				<option></option>
				<option value="true">Com Rastreador</option>
				<option value="null">Sem Rastreador</option>
			</Form.Select>
		),
		showFilter: true,
		//sortable: "sortable",
	},
	{
		name: "categoria_veiculo",
		description: "Categoria",
		selector: (row) => {
			if (!row.categoria_veiculo) return "";
			switch (row.categoria_veiculo) {
				case "A":
					return "Agregado";
				case "F":
					return "Frota Própria";
				case "C":
					return "Carreteiro";
				default:
					return "Não reconhecido";
			}
		},
		Filter: (props) => (
			<Form.Select {...props}>
				<option></option>
				<option value="A">Agregado</option>
				<option value="C">Carreteiro</option>
				<option value="F">Frota Própria</option>
			</Form.Select>
		),
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
		name: "ponto_parada[0].COLETA_EFETIVA_POSTO30",
		description: "Inicio Efetivo Posto 30",
		selector: (row) =>
			row.ponto_parada?.length
				? DateUtils.formatDateTresHorasMenos(
						row?.ponto_parada[0]?.COLETA_EFETIVA_POSTO30
				  )
				: "",
	},
	{
		name: "ponto_parada[0].SAIDA_EFETIVA_COLETA",
		description: "Fim Efetivo Posto 30",
		selector: (row) =>
			row.ponto_parada?.length
				? DateUtils.formatDateTresHorasMenos(
						row?.ponto_parada[0]?.SAIDA_EFETIVA_COLETA
				  )
				: "",
	},
	{
		name: "ponto_parada[1].COLETA_EFETIVA_MUNDO",
		description: "Inicio Efetivo Mundo",
		selector: (row) =>
			row.ponto_parada?.length
				? DateUtils.formatDateTresHorasMenos(
						row?.ponto_parada[1]?.COLETA_EFETIVA_MUNDO
				  )
				: "",
	},
	{
		name: "ponto_parada[1].SAIDA_EFETIVA_COLETA",
		description: "Fim Efetivo Mundo",
		selector: (row) =>
			row.ponto_parada?.length
				? DateUtils.formatDateTresHorasMenos(
						row?.ponto_parada[1]?.SAIDA_EFETIVA_COLETA
				  )
				: "",
	},
	{
		name: "ponto_parada[2].COLETA_EFETIVA_PEACAO",
		description: "Inicio Efetivo Peacao",
		selector: (row) =>
			row.ponto_parada?.length
				? DateUtils.formatDateTresHorasMenos(
						row?.ponto_parada[2]?.COLETA_EFETIVA_PEACAO
				  )
				: "",
	},
	{
		name: "ponto_parada[2].SAIDA_EFETIVA_COLETA",
		description: "Fim Efetivo Peacao",
		selector: (row) =>
			row.ponto_parada?.length
				? DateUtils.formatDateTresHorasMenos(
						row?.ponto_parada[2]?.SAIDA_EFETIVA_COLETA
				  )
				: "",
	},
	{
		name: "ponto_parada[3].ENTREGA_EFETIVA",
		description: "Inicio Efetivo Entrega",
		selector: (row) => {
			const horasEntregaEfetiva = row.ponto_parada?.length
				? DateUtils.formatDateTresHorasMenos(
						row?.ponto_parada[3]?.ENTREGA_EFETIVA
				  )
				: "";
			return <div>{horasEntregaEfetiva}</div>;
		},
	},
	{
		name: "ponto_parada[3].SAIDA_EFETIVA_ENTREGA",
		description: "Fim Efetivo Entrega",
		selector: (row) => {
			const horasEntregaEfetiva = row.ponto_parada?.length
				? DateUtils.formatDateTresHorasMenos(
						row?.ponto_parada[3]?.SAIDA_EFETIVA_ENTREGA
				  )
				: "";
			return <div>{horasEntregaEfetiva}</div>;
		},
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
		Filter: (props) => <ResponsavelCadastroSelect user="csn" {...props} />,
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
	{
		name: "canal_comunicacao",
		description: "Canal de comunicação",
		selector: (row) => row.canal_comunicacao,
		//sortable: "sortable",
		Filter: (props) => (
			<Form.Select {...props}>
				<option></option>
				<option value="manual">Manual</option>
				<option value="robô">Robô</option>
			</Form.Select>
		),
		showFilter: true,
	},
];
