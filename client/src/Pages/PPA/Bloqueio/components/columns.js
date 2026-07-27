import { Form } from "react-bootstrap";
import { formatDateAndHourForColumns } from "src/Pages/Utils/date";

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf,
			showFilter: true,
		},
		{
			name: "motorista",
			description: "Motorista",
			selector: (row) => String(row.motorista).toUpperCase(),
			showFilter: true,
		},
		{
			name: "placa_veiculo",
			description: "Placa Veículo",
			selector: (row) => row.placa_veiculo,
			showFilter: true,
		},
		{
			name: "periodo_inicial",
			description: "Período Inicial",
			selector: (row) => formatDateAndHourForColumns(row.periodo_inicial),
			showFilter: true,
			Filter: (props) => <Form.Control type="date" {...props} />,
		},
		{
			name: "periodo_final",
			description: "Período Final",
			selector: (row) => formatDateAndHourForColumns(row.periodo_final),
			showFilter: true,
			Filter: (props) => <Form.Control type="date" {...props} />,
		},
		{
			name: "total_pontos",
			description: "Pontuação",
			sortable: "sortable",
			selector: (row) => row.total_pontos,
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
