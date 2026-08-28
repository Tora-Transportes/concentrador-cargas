import { Form } from "react-bootstrap";
import { formatDateAndHourForColumns } from "src/Pages/Utils/date";
import { MdDeleteSweep } from "react-icons/md";

export const getColumns = (handleRemovePontuacao) => {
	const columnsRelatorio = [
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => <span className="ppa-document">{row.cpf}</span>,
			showFilter: true,
			style: { width: "150px", minWidth: "150px" },
		},
		{
			name: "motorista",
			description: "Motorista",
			selector: (row) => String(row.motorista).toUpperCase(),
			showFilter: true,
			style: { width: "300px", minWidth: "300px" },
		},
		{
			name: "placa_veiculo",
			description: "Placa do veículo",
			selector: (row) => <span className="ppa-plate">{row.placa_veiculo}</span>,
			showFilter: true,
			style: { width: "135px", minWidth: "135px" },
		},
		{
			name: "periodo_inicial",
			description: "Período inicial",
			selector: (row) => formatDateAndHourForColumns(row.periodo_inicial),
			showFilter: true,
			Filter: (props) => <Form.Control type="date" {...props} />,
			style: { width: "190px", minWidth: "190px" },
		},
		{
			name: "periodo_final",
			description: "Período final",
			selector: (row) => formatDateAndHourForColumns(row.periodo_final),
			showFilter: true,
			Filter: (props) => <Form.Control type="date" {...props} />,
			style: { width: "190px", minWidth: "190px" },
		},
		{
			name: "total_pontos",
			description: "Pontuação",
			sortable: "sortable",
			selector: (row) => (
				<span className="ppa-score ppa-score--blocked">{row.total_pontos}</span>
			),
			showFilter: false,
			style: { width: "110px", minWidth: "110px" },
		},
		{
			name: "acoes",
			description: "Ações",
			selector: (row) => (
				<button
					type="button"
					className="ppa-remove-points-button"
					onClick={() => handleRemovePontuacao(row)}
					title="Remover pontuação deste período"
					aria-label={`Remover pontuação de ${row.motorista} neste período`}
				>
					<MdDeleteSweep />
				</button>
			),
			showFilter: false,
			static_column: true,
			style: { width: "100px", minWidth: "100px" },
		},
	];

	return { columnsRelatorio };
};
