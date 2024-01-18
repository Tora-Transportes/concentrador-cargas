import { Button, Form } from "react-bootstrap";
import { formatDateTimeZone } from "../../../Utils/formatDate";
import swal from "sweetalert";
import { BsInfoCircle } from "react-icons/bs";

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "tipo",
			description: "Tipo Execução",
			selector: (row) => (row.tipo === false ? "AUTO" : "MANUAL"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="0"> AUTO </option>
					<option value="1"> MANUAL </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "status",
			description: "Status",
			selector: (row) =>
				row.status === 0
					? "Aguardando Execução"
					: row.status === 1
					? "Em Execução"
					: "Executado",
			Filter: false,
		},
		{
			name: "mes",
			description: "Mês",
			selector: (row) => row.mes,
			showFilter: true,
		},
		{
			name: "ano",
			description: "Ano",
			selector: (row) => row.ano,
			showFilter: true,
		},
		{
			name: "qtd_processada",
			description: "Processamento Qtd.",
			selector: (row) => row.qtd_processada,
			showFilter: false,
		},
		{
			name: "qtd_final",
			description: "Qtd. Final a Processar",
			selector: (row) => row.qtd_final,
			showFilter: false,
		},
		{
			name: "observacao",
			description: "Observação",
			selector: (row) => (
				<Button
					variant="outline-primary"
					onClick={(e) => {
						e.preventDefault();
						swal(row.observacao);
					}}
				>
					<BsInfoCircle className="icon-info" />
					Info
				</Button>
			),
			showFilter: false,
		},
		{
			name: "created_at",
			description: "Criado em",
			selector: (row) => formatDateTimeZone(row.created_at),
			showFilter: false,
		},
		{
			name: "cod_usu_create",
			description: "Usuário Criação",
			selector: (row) => row.cod_usu_create,
			showFilter: false,
		},
		{
			name: "updated_at",
			description: "Atualizado em",
			selector: (row) => formatDateTimeZone(row.updated_at),
			showFilter: false,
		},
		{
			name: "cod_usu_update",
			description: "Usuário Atualização",
			selector: (row) => row.cod_usu_update,
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
