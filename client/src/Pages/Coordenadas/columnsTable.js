import { SiGooglemaps } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
//import { GiArchiveResearch } from "react-icons/gi";
import DateUtils from "../Utils/date";
import { Button, Form } from "react-bootstrap";
import CollapseHint from "../Components/CollapseHint";
import ResponsavelCadastroSelect from "../Components/ResponsavelCadastroSelect";
//mport swal from "sweetalert";
//import { Link } from "react-router-dom";

export const getColumns = (
	handleChangeDataJanela,
	perguntarEAlterarDadosCoordenada,
	handleChangeResponsavelPlaca,
	showCardCTE
) => {
	return [
		{
			id: "coluna1",
			name: "",
			description: "Detalhes",
			selector: (row) => (
				<Button
					id="coluna1"
					variant="Link"
					onClick={() => showCardCTE(row)}
					className="text-primary"
				>
					<BsInfoCircle className="mb-1" /> CTE
				</Button>
			),
		},
		{
			name: "placa",
			description: "Placa",
			selector: (row) => row.placa,
		},
		{
			name: "tipo_cavalo",
			description: "Tipo cavalo",
			selector: (row) => row.tipo_cavalo,
		},
		{
			name: "tipo_carreta",
			description: "Tipo carreta",
			selector: (row) => row.tipo_carreta,
		},
		// {
		// 	name: "apelido_carreta",
		// 	description: "Apelido Carreta",
		// 	selector: (row) => row.apelido_carreta,
		// },
		// {
		// 	name: "link",
		// 	description: "Link",
		// 	static_column: true,
		// 	selector: (row) => {
		// 		return (
		// 			<Link
		// 				to={`/cargas/manual/visualizar/${row.id}`}
		// 				target="_blank"
		// 				rel="noopener"
		// 			>
		// 				<GiArchiveResearch className="fs-5" />
		// 			</Link>
		// 		);
		// 	},
		// 	sortable: "sortable",
		// },
		{
			name: "telefone_motorista",
			description: "Telefone Motorista",
			selector: (row) => {
				if (!row.telefone_motorista) return "";

				const telefone = "55" + row.telefone_motorista?.replace(/\D/g, "");
				return (
					<a
						className="text-decoration-none"
						href={`https://web.whatsapp.com/send/?phone=${telefone}&text=Olá ${row.nome_motorista}`}
						rel="nofollow noreferrer"
						target="_blank"
					>
						{row.telefone_motorista}
					</a>
				);
			},
		},
		// {
		// 	name: "cpf_motorista",
		// 	description: "Cpf motorista",
		// 	selector: (row) => row.cpf_motorista,
		// },
		{
			name: "setor_veiculo",
			description: "Setor Veículo",
			selector: (row) => row.setor_veiculo,
		},
		{
			name: "data_emissao_documento",
			description: "Emissão Doc. ultima viagem",
			selector: (row) =>
				row.data_emissao_documento
					?.split("T")[0]
					.split("-")
					.reverse()
					.join("-"),
			Filter: () => null,
		},
		{
			name: "ultima_viagem_origem",
			description: "Origem ultima viagem",
			selector: (row) => row.ultima_viagem_origem,
		},
		{
			name: "ultima_viagem_destino",
			description: "Destino ultima viagem",
			selector: (row) => row.ultima_viagem_destino,
		},
		{
			name: "distancia_prevista",
			description: "Distância prevista rota",
			selector: (row) =>
				row.distancia_prevista ? `${row.distancia_prevista} KM` : "NC",
		},
		{
			name: "distancia_ate_destino",
			description: "Distância veículo até destino",
			selector: (row) => {
				if (!row.distancia_ate_destino) {
					return "";
				}
				return `${Number(row.distancia_ate_destino).toFixed(2)} KM`;
			},
			Filter: () => null,
		},
		{
			name: "tempo_ate_destino",
			description: "Previsão Calculada",
			selector: (row) => {
				if (!row.tempo_ate_destino) {
					return "";
				}
				return DateUtils.convertDateToReadableTime(
					Number(row.tempo_ate_destino)
				);
			},
			Filter: () => null,
		},
		{
			name: "data_previsao_chegada",
			description: "Previsão Real",
			selector: (row) => {
				if (!row.data_previsao_chegada) {
					return "";
				}
				return row.data_previsao_chegada
					.split("T")[0]
					.split("-")
					.reverse()
					.join("-");
			},
			Filter: () => null,
		},
		{
			name: "status_prazo",
			description: "Status prazo",
			selector: (row) => {
				if (!row.data_previsao_chegada) {
					return "NC";
				}
				const currentDate = new Date().toISOString().split("T")[0];
				return currentDate <= row.data_previsao_chegada.split("T")[0] ? (
					<span className="text-success">Dentro do prazo</span>
				) : (
					<span className="text-danger">Fora do prazo</span>
				);
			},
			Filter: () => null,
			static_column: true,
		},
		{
			name: "cidade_atual",
			description: "Posição Atual",
			selector: (row) => (
				<a
					href={`https://www.google.com/maps/search/${String(row.lat).replace(
						",",
						"."
					)},+${String(row.lon).replace(",", ".")}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-decoration-none"
				>
					{row.cidade_atual + " "}
					<SiGooglemaps />
				</a>
			),
		},
		{
			name: "categoria_veiculo",
			description: "Categoria",
			selector: (row) => {
				if (!row.categoria_veiculo) return "";
				switch (row.categoria_veiculo) {
					case "A":
						return "Agregado";
					case "F":
						return "Frota";
					case "C":
						return "Carreteiro";
					default:
						return "Não reconhecido";
				}
			},
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="A">Agregado</option>
					<option value="C">Carreteiro</option>
					<option value="F">Frota</option>
				</Form.Select>
			),
		},
		{
			name: "data_janela",
			description: "Data Janela",
			selector: (row) => (
				<Form.Control
					value={row.data_janela ? String(row.data_janela).split(".")[0] : ""}
					type="datetime-local"
					onChange={({ target }) => handleChangeDataJanela(row, target)}
				/>
			),
		},
		{
			name: "observacao",
			description: "Observação Usuario",
			selector: (row) =>
				row.observacao ? (
					<CollapseHint
						text={row.observacao}
						onClick={() => {
							perguntarEAlterarDadosCoordenada(row.placa);
						}}
					/>
				) : (
					<Button
						variant="outline-secondary"
						onClick={() => {
							perguntarEAlterarDadosCoordenada(row.placa);
						}}
					>
						Adicionar
					</Button>
				),
		},
		{
			name: "documento",
			description: "Documento",
			selector: (row) => row.documento,
		},
		{
			name: "tipo_documento",
			description: "Tipo Documento",
			selector: (row) => row.tipo_documento,
			Filter: (parameters) => (
				<Form.Select {...parameters}>
					<option></option>
					<option value="DVF">DVF</option>
					<option value="RPA">RPA</option>
				</Form.Select>
			),
		},
		{
			name: "nome_motorista",
			description: "Motorista",
			selector: (row) => row.nome_motorista,
		},
		{
			name: "responsavel_placa_nome",
			description: "RP Nome",
			selector: (row) => (
				<ResponsavelCadastroSelect
					onChange={({ target }) => handleChangeResponsavelPlaca(row, target)}
					value={row.responsavel_placa || ""}
					key_value="oid"
				/>
			),
			Filter: (props) => <ResponsavelCadastroSelect {...props} />,
		},
		{
			name: "responsavel_placa_email",
			description: "RP Email",
			selector: (row) => row.responsavel_placa_email,
			static_column: true,
		},
		{
			name: "mct",
			description: "MCT",
			selector: (row) => row.mct,
		},
		{
			name: "data_calculo",
			description: "Data cálculo distância",
			selector: (row) => {
				if (!row?.data_calculo) {
					return "";
				}
				const [data, time] = row.data_calculo?.split("T");
				return `${data.split("-").reverse().join("-")} às ${
					time.split(".")[0]
				}`;
			},
			Filter: () => null,
		},
	];
};
