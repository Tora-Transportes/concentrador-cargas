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
			style: { minWidth: "165px" },
		},
		{
			name: "tipo_veiculo",
			description: "Detalhes da viagem",
			selector: (row) => {
				return (
					<Button
						aria-label="Visualizar detalhes da viagem"
						title="Visualizar detalhes da viagem"
						variant="link"
						onClick={(e) => {
							e.preventDefault();
							exibirDetalhesVeiculo(row);
						}}
					>
						<FaTruckArrowRight className="icon-info" />
					</Button>
				);
			},
			style: { minWidth: "120px" },
		},
		{
			name: "motorista",
			description: "Motorista",
			selector: (row) => row.motorista,
			showFilter: true,
			style: { minWidth: "240px" },
		},
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => (
				<span className="ppa-document">{row.cpf_motorista}</span>
			),
			showFilter: true,
			style: { minWidth: "145px" },
		},
		{
			name: "placa_veiculo",
			description: "Placa do veículo",
			selector: (row) => <span className="ppa-plate">{row.placa_veiculo}</span>,
			showFilter: true,
			style: { minWidth: "135px" },
		},
		{
			name: "area_producao",
			description: "Área de produção",
			selector: (row) => row.area_producao,
			showFilter: true,
			style: { minWidth: "165px" },
		},
		{
			name: "referencia_posicao",
			description: "Referência da posição",
			selector: (row) => row.referencia_posicao,
			showFilter: false,
			style: { minWidth: "280px" },
		},
		{
			name: "vel_aferida",
			description: "Vel. aferida",
			selector: (row) => <span className="ppa-metric">{row.vel_aferida}</span>,
			showFilter: false,
			sortable: "sortable",
			style: { minWidth: "110px" },
		},
		{
			name: "vel_permitida",
			description: "Vel. permitida",
			selector: (row) => (
				<span className="ppa-metric">{row.vel_permitida}</span>
			),
			showFilter: false,
			sortable: "sortable",
			style: { minWidth: "120px" },
		},
		{
			name: "pontuacao",
			description: "Pontuação",
			selector: (row) => <span className="ppa-score">{row.pontuacao}</span>,
			showFilter: false,
			sortable: "sortable",
			style: { minWidth: "105px" },
		},
	];

	return { columnsRelatorio };
};
