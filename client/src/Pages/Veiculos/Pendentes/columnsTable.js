import { Button } from "react-bootstrap";
import { BsHandThumbsDownFill, BsHandThumbsUpFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export const getColumns = (aprovarVeiculo, reprovarVeiculo) => {
	return [
		{
			name: "id",
			description: "Codigo da carga",
			selector: (row) => (
				<Link
					target="_blank"
					className="text-decoration-none"
					to={`/cargas/manual/${row.id}`}
				>
					{row.id}
				</Link>
			),
		},
		{
			name: "documento_transporte",
			description: "Doc Transporte",
			selector: (row) => row.documento_transporte,
		},
		{
			name: "placa_veiculo",
			description: "Placa veículo",
			selector: (row) => row.placa_veiculo,
		},
		{
			name: "origem_carga",
			description: "Origem",
			selector: (row) => row.origem_carga,
		},
		{
			name: "destino_carga",
			description: "Destino",
			selector: (row) => row.destino_carga,
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
