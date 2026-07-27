import { Button, Form } from "react-bootstrap";
import { FaTruckArrowRight } from "react-icons/fa6";
import { formatDateAndHourForColumns } from "src/Pages/Utils/date";
import Swal from "sweetalert2";

const escapeHtml = (value) =>
	String(value ?? "Não informado")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");

const exibirDetalhesVeiculo = (row) => {
	const tipo_veiculo =
		String(row.tipo_veiculo).trim().length === 0
			? "SEM INFORMAÇÃO"
			: row.tipo_veiculo;
	const placaCarreta =
		String(row.placa_carreta).trim().length === 0
			? "SEM INFORMAÇÃO"
			: row.placa_carreta;
	const cidadeOrigem =
		String(row.cidade_origem).trim().length === 0
			? "SEM INFORMAÇÃO"
			: row.cidade_origem;
	const cidadeDestino =
		String(row.cidade_destino).trim().length === 0
			? "SEM INFORMAÇÃO"
			: row.cidade_destino;

	Swal.fire({
		title: "Detalhes da viagem",
		iconHtml: '<span class="ppa-vehicle-alert__truck">🚛</span>',
		html: `
			<div class="ppa-vehicle-alert__content">
				<div class="ppa-vehicle-alert__item"><span class="ppa-vehicle-alert__label">Tipo Veículo</span><strong>${escapeHtml(
					tipo_veiculo
				)}</strong></div>
				<div class="ppa-vehicle-alert__item"><span class="ppa-vehicle-alert__label">Placa da carreta</span><strong class="ppa-vehicle-alert__plate">${escapeHtml(
					placaCarreta
				)}</strong></div>
				<div class="ppa-vehicle-alert__item"><span class="ppa-vehicle-alert__label">Cidade Origem</span><strong>${escapeHtml(
					cidadeOrigem
				)}</strong></div>
				<div class="ppa-vehicle-alert__item"><span class="ppa-vehicle-alert__label">Cidade Destino</span><strong>${escapeHtml(
					cidadeDestino
				)}</strong></div>
			</div>`,
		confirmButtonText: "Fechar",
		buttonsStyling: false,
		customClass: {
			popup: "ppa-vehicle-alert",
			icon: "ppa-vehicle-alert__icon",
			confirmButton: "ppa-vehicle-alert__button",
		},
	});
};

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "data_inclusao",
			description: "Data de inclusão",
			selector: (row) => formatDateAndHourForColumns(row.data_inclusao),
			showFilter: true,
			Filter: (props) => <Form.Control type="date" {...props} />,
		},
		{
			name: "tipo_veiculo",
			description: "Detalhes Viagem",
			selector: (row) => {
				return (
					<Button
						aria-label="Visualizar detalhes do veículo"
						title="Visualizar detalhes do veículo"
						variant="Link"
						onClick={(e) => {
							e.preventDefault();
							exibirDetalhesVeiculo(row);
						}}
						className="text-primary"
					>
						<FaTruckArrowRight className="icon-info" />
					</Button>
				);
			},
		},
		{
			name: "motorista",
			description: "Motorista",
			selector: (row) => row.motorista,
			showFilter: true,
		},
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf_motorista,
			showFilter: true,
		},
		{
			name: "placa_veiculo",
			description: "Placa Veículo",
			selector: (row) => row.placa_veiculo,
			showFilter: true,
		},
		{
			name: "area_producao",
			description: "Área de Produção",
			selector: (row) => row.area_producao,
			showFilter: true,
		},
		{
			name: "vel_aferida",
			description: "Velocidade Aferida",
			selector: (row) => row.vel_aferida,
			showFilter: false,
			sortable: "sortable",
		},
		{
			name: "vel_permitida",
			description: "Velocidade Permitida",
			selector: (row) => row.vel_permitida,
			showFilter: false,
			sortable: "sortable",
		},
		{
			name: "pontuacao",
			description: "Pontuação",
			selector: (row) => row.pontuacao,
			showFilter: false,
			sortable: "sortable",
		},
	];

	return { columnsRelatorio };
};
