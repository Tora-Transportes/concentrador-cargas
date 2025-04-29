import { Form } from "react-bootstrap";

function formatDateAndHour(date) {
	if (!date) return "";
	const [day, time] = date?.split("T");
	const daysFormatted = day.split("-").reverse().join("/");
	const timeFormatted = time.split(".")[0];
	return `${daysFormatted} ${timeFormatted}`;
}

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
			description: "CPF Motorista",
			selector: (row) => row.cpf,
			showFilter: true,
		},
		{
			name: "tipo",
			description: "Tipo Movimentação",
			selector: (row) => (row.tipo === "exclusao" ? "Exclusão" : "Inclusão"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="exclusao"> Exclusão </option>
					<option value="inclusao"> Inclusão </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "tipo_ppo",
			description: "Tioo PPO",
			selector: (row) => (row.tipo_ppo === 1 ? "Automático" : "Manual"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="1"> Automático </option>
					<option value="2"> Manual </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "created_user",
			description: "Criado por",
			selector: (row) => row.created_user,
			showFilter: false,
		},
		{
			name: "created_at",
			description: "Data Criação",
			selector: (row) => formatDateAndHour(row.created_at),
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
