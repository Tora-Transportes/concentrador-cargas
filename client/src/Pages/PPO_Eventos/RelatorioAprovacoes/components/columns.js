import { Form } from "react-bootstrap";

const status = [
	"Aguardando aprovação supervisor",
	"Aprovado Supervisor aguardando Gerente",
	"Aprovado Supervisor e Gerente",
	"Reprovado pelo Supervisor",
	"Reprovado pelo Gerente",
];

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "mes",
			description: "Mês",
			selector: (row) => row.mes,
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="01"> Janeiro </option>
					<option value="02"> Fevereiro </option>
					<option value="03"> Março </option>
					<option value="04"> Abril </option>
					<option value="05"> Maio </option>
					<option value="06"> Junho </option>
					<option value="07"> Julho </option>
					<option value="08"> Agosto </option>
					<option value="09"> Setembro </option>
					<option value="10"> Outubro </option>
					<option value="11"> Novembro </option>
					<option value="12"> Dezembro </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "ano",
			description: "Ano",
			selector: (row) => row.ano,
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="2024"> 2024 </option>
					<option value="2025"> 2025 </option>
					<option value="2026"> 2026 </option>
					<option value="2027"> 2027 </option>
					<option value="2028"> 2028 </option>
					<option value="2029"> 2029 </option>
					<option value="2030"> 2030 </option>
					<option value="2031"> 2031 </option>
					<option value="2032"> 2032 </option>
					<option value="2033"> 2033 </option>
					<option value="2034"> 2034 </option>
					<option value="2035"> 2035 </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf,
			showFilter: true,
		},
		{
			name: "nome",
			description: "Nome",
			selector: (row) => row.nome,
			showFilter: true,
		},
		{
			name: "matricula",
			description: "Matricula",
			selector: (row) => row.matricula,
			showFilter: true,
		},
		{
			name: "horas",
			description: "Horas",
			selector: (row) => `${row.horas} horas`,
			showFilter: false,
		},
		{
			name: "status_aprovacao",
			description: "Status",
			selector: (row) => status[row.status_aprovacao],
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="0"> {status[0]} </option>
					<option value="1"> {status[1]} </option>
					<option value="2"> {status[2]} </option>
					<option value="3"> {status[3]} </option>
					<option value="4"> {status[4]} </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "aprovado",
			description: "Aprovado",
			selector: (row) => (row.aprovado ? "Sim" : "Não"),
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
			name: "obs_supervisor",
			description: "Obs. Supervisor",
			selector: (row) => row.obs_supervisor,
			showFilter: false,
		},
		{
			name: "obs_gerente",
			description: "Obs. Gerente",
			selector: (row) => row.obs_gerente,
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
