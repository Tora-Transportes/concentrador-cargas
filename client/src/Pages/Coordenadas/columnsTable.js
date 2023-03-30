import { SiGooglemaps } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { GiArchiveResearch } from "react-icons/gi";
import DateUtils from "../Utils/date";
import { Button, Form } from "react-bootstrap";
import CollapseHint from "../Components/CollapseHint";
import ResponsavelCadastroSelect from "../Components/ResponsavelCadastroSelect";
import { useHistory } from "react-router-dom";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import { showToastMessage } from "../Utils/toastMessage";

export const getColumns = (
	handleChangeDataJanela,
	perguntarEAlterarDadosCoordenada,
	handleChangeResponsavelPlaca,
	showCardCTE,
	showCardLastLocation,
	toast
) => {
	const history = useHistory();
	const existeCarga = async (placa) => {
		const { status } = await ServiceCoordenadas.searchByPlate(placa);
		if (status === 200) {
			history.push(`/cargas/consulta/${placa}`);
		} else {
			toast.current.clear();
			const message = "Não existe informações da carga para esta busca!";
			await showToastMessage(toast, "warn", message, 5000);
		}
	};

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
			showFilter: true,
		},
		{
			name: "placa_carreta",
			description: "Placa Carreta",
			selector: (row) => row.placa_carreta,
			showFilter: true,
		},
		{
			name: "placa_bitrem",
			description: "Placa Bitrem",
			selector: (row) => row.placa_bitrem,
			showFilter: true,
		},
		{
			name: "tipo_cavalo",
			description: "Tipo cavalo",
			selector: (row) => row.tipo_cavalo,
			showFilter: true,
		},
		{
			name: "tipo_carreta",
			description: "Tipo carreta",
			selector: (row) => row.tipo_carreta,
			showFilter: true,
		},
		{
			name: "apelido_carreta",
			description: "Apelido carreta",
			selector: (row) => row.apelido_carreta,
			showFilter: true,
		},
		{
			name: "link",
			description: "Detalhes da carga",
			static_column: true,
			selector: (row) => {
				if (row?.placa) {
					return (
						<Button
							id="coluna1"
							variant="Link"
							onClick={() => existeCarga(row.placa)}
							className="text-primary"
						>
							<GiArchiveResearch className="fs-5" />
						</Button>
					);
				}
			},
		},
		{
			name: "telefone_motorista",
			description: "Telefone motorista",
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
			showFilter: true,
		},
		{
			name: "lastLocation",
			description: "Última localização",
			selector: (row) => (
				<Button
					variant="Link"
					onClick={() => showCardLastLocation(row?.placa)}
					className="text-primary"
				>
					Localização <BsInfoCircle />
				</Button>
			),
		},
		{
			name: "setor_veiculo",
			description: "Setor veículo",
			selector: (row) => row.setor_veiculo,
			showFilter: true,
		},
		{
			name: "data_emissao_documento",
			description: "Emissão Doc. última viagem",
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
			description: "Origem última viagem",
			selector: (row) => row.ultima_viagem_origem,
			showFilter: true,
		},
		{
			name: "ultima_viagem_destino",
			description: "Destino última viagem",
			selector: (row) => row.ultima_viagem_destino,
			showFilter: true,
		},
		{
			name: "distancia_prevista",
			description: "Distância prevista rota",
			selector: (row) =>
				row.distancia_prevista ? `${row.distancia_prevista} KM` : "NC",
			showFilter: true,
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
			description: "Previsão calculada",
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
			description: "Previsão real",
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
			description: "Posição atual",
			selector: (row) => {
				const existeLatitude = row.lat;
				return (
					<>
						{existeLatitude !== 0 ? (
							<a
								href={`https://www.google.com/maps/search/${String(
									row.lat
								).replace(",", ".")},+${String(row.lon).replace(",", ".")}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-decoration-none"
							>
								{row.cidade_atual ? row.cidade_atual + " " : " "}
								<SiGooglemaps />
							</a>
						) : (
							"Sem comunicação com rastreador"
						)}
					</>
				);
			},
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
			showFilter: true,
		},
		{
			name: "data_janela",
			description: "Data janela",
			selector: (row) => (
				<Form.Control
					value={
						row.data_janela
							? String(row.data_janela.substring(0, row.data_janela.length - 8))
							: ""
					}
					type="datetime-local"
					onChange={({ target }) => handleChangeDataJanela(row, target)}
				/>
			),
			showFilter: true,
		},
		{
			name: "observacao",
			description: "Observação usuário",
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
			showFilter: true,
		},
		{
			name: "documento",
			description: "Documento",
			selector: (row) => row.documento,
			showFilter: true,
		},
		{
			name: "tipo_documento",
			description: "Tipo de documento",
			selector: (row) => row.tipo_documento,
			Filter: (parameters) => (
				<Form.Select {...parameters}>
					<option></option>
					<option value="DVF">DVF</option>
					<option value="RPA">RPA</option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "nome_motorista",
			description: "Motorista",
			selector: (row) => row.nome_motorista,
			showFilter: true,
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
			showFilter: true,
		},
		{
			name: "responsavel_placa_email",
			description: "RP E-mail",
			selector: (row) => row.responsavel_placa_email,
			static_column: true,
		},
		{
			name: "mct",
			description: "MCT",
			selector: (row) => row.mct,
			showFilter: true,
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
