import { Form } from "react-bootstrap";
import { formatDateAndHourForColumns } from "src/Pages/Utils/date";

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => <span className="ppa-document">{row.cpf}</span>,
			showFilter: true,
			style: { minWidth: "145px" },
		},
		{
			name: "motorista",
			description: "Motorista",
			selector: (row) => String(row.motorista).toUpperCase(),
			showFilter: true,
			style: { minWidth: "260px" },
		},
		{
			name: "placa_veiculo",
			description: "Placa do veículo",
			selector: (row) => <span className="ppa-plate">{row.placa_veiculo}</span>,
			showFilter: true,
			style: { minWidth: "135px" },
		},
		{
			name: "periodo_inicial",
			description: "Período inicial",
			selector: (row) => formatDateAndHourForColumns(row.periodo_inicial),
			showFilter: true,
			Filter: (props) => <Form.Control type="date" {...props} />,
			style: { minWidth: "175px" },
		},
		{
			name: "periodo_final",
			description: "Período final",
			selector: (row) => formatDateAndHourForColumns(row.periodo_final),
			showFilter: true,
			Filter: (props) => <Form.Control type="date" {...props} />,
			style: { minWidth: "175px" },
		},
		{
			name: "total_pontos",
			description: "Pontuação",
			sortable: "sortable",
			selector: (row) => (
				<span className="ppa-score ppa-score--blocked">{row.total_pontos}</span>
			),
			showFilter: false,
			style: { minWidth: "110px" },
		},
	];

	return { columnsRelatorio };
};
