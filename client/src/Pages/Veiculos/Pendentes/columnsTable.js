import { Button } from "react-bootstrap";
import { BsHandThumbsDownFill, BsHandThumbsUpFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export const getColumns = (aprovarVeiculo, reprovarVeiculo) => {
	return [
		{
			name: "id",
			description: "Código da carga",
			selector: (row) => (
				<Link
					target="_blank"
					className="text-decoration-none"
					to={`/cargas/manual/${row.id}`}
				>
					{row.id}
				</Link>
			),
			showFilter: true,
		},
		{
			name: "",
			description: "TESTE",
			selector: () => "Monitoramento",
		},
		{
			name: "documento_transporte",
			description: "Doc. Transporte",
			selector: (row) => row.documento_transporte,
			showFilter: true,
		},
		{
			name: "placa_veiculo",
			description: "Placa veículo",
			selector: (row) => row.placa_veiculo,
			showFilter: true,
		},
		{
			name: "origem_carga",
			description: "Origem",
			selector: (row) => row.origem_carga,
			showFilter: true,
		},
		{
			name: "destino_carga",
			description: "Destino",
			selector: (row) => row.destino_carga,
			showFilter: true,
		},
		{
			name: "Aprovar",
			description: "Aprovar",
			static_column: true,
			selector: (row) => (
				<Button variant="" onClick={() => aprovarVeiculo(row)}>
					<BsHandThumbsUpFill style={{ color: "green" }} />
				</Button>
			),
		},
		{
			name: "Reprovar",
			description: "Reprovar",
			static_column: true,
			selector: (row) => (
				<Button variant="" onClick={() => reprovarVeiculo(row)}>
					<BsHandThumbsDownFill style={{ color: "red" }} />
				</Button>
			),
		},
	];
};
