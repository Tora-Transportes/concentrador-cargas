import { Button, Form } from "react-bootstrap";
import { formatDateTimeZone } from "../../../Utils/formatDate";
import swal from "sweetalert";
import { BsInfoCircle } from "react-icons/bs";

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "metodo",
			description: "Metodo",
			selector: (row) => row.metodo,
			showFilter: true,
		},
		{
			name: "status",
			description: "Status",
			selector: (row) => row.status,
			showFilter: true,
		},
		{
			name: "cod_carga",
			description: "Cod. Carga",
			selector: (row) => row.cod_carga,
			showFilter: true,
		},
		{
			name: "erro",
			description: "Erro",
			selector: (row) => (row.erro === "true" ? "Sim" : "Não"),
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
			name: "json_envio",
			description: "Json Enviado",
			selector: (row) => (
				<Button
					variant="outline-primary"
					onClick={(e) => {
						e.preventDefault();
						swal(row.json_envio);
					}}
				>
					<BsInfoCircle className="icon-info" />
					Info
				</Button>
			),
			showFilter: false,
		},
		{
			name: "json_retorno",
			description: "Json Recebido",
			selector: (row) => (
				<Button
					variant="outline-primary"
					onClick={(e) => {
						e.preventDefault();
						swal(row.json_retorno);
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
	];

	return { columnsRelatorio };
};
