import { Form } from "react-bootstrap";
import { formatDateTimeZone } from "src/Pages/Utils/formatDate";

const estadosBrasil = [
	"AC", // Acre
	"AL", // Alagoas
	"AM", // Amazonas
	"AP", // Amapá
	"BA", // Bahia
	"CE", // Ceará
	"DF", // Distrito Federal
	"ES", // Espírito Santo
	"GO", // Goiás
	"MA", // Maranhão
	"MG", // Minas Gerais
	"MS", // Mato Grosso do Sul
	"MT", // Mato Grosso
	"PA", // Pará
	"PB", // Paraíba
	"PE", // Pernambuco
	"PI", // Piauí
	"PR", // Paraná
	"RJ", // Rio de Janeiro
	"RN", // Rio Grande do Norte
	"RO", // Rondônia
	"RR", // Roraima
	"RS", // Rio Grande do Sul
	"SC", // Santa Catarina
	"SE", // Sergipe
	"SP", // São Paulo
	"TO", // Tocantins
];

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
			name: "id_pacote",
			description: "ID Pacote",
			selector: (row) => row.id_pacote,
			showFilter: true,
		},
		{
			name: "data_pacote",
			description: "Data Pacote",
			selector: (row) => formatDateTimeZone(row.data_pacote),
		},
		{
			name: "cod_evento",
			description: "Cod. Evento",
			selector: (row) => row.cod_evento,
			showFilter: true,
		},
		{
			name: "id_rastreador",
			description: "ID Rastreador",
			selector: (row) => row.id_rastreador,
			showFilter: true,
		},
		{
			name: "placa",
			description: "Placa",
			selector: (row) => row.placa,
			showFilter: true,
		},
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf,
			showFilter: true,
		},
		{
			name: "matricula",
			description: "Matricula",
			selector: (row) => row.matricula,
			showFilter: true,
		},
		{
			name: "cidade",
			description: "Cidade",
			selector: (row) => row.cidade,
			showFilter: true,
		},
		{
			name: "uf",
			description: "UF",
			selector: (row) => row.uf,
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					{estadosBrasil.map((uf) => (
						<option key={uf} value={uf}>
							{uf}
						</option>
					))}
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "lat",
			description: "Latitude",
			selector: (row) => row.lat,
		},
		{
			name: "long",
			description: "Longitude",
			selector: (row) => row.long,
		},
		{
			name: "ponto_ref",
			description: "Ponto Referência",
			selector: (row) => row.ponto_ref,
		},
	];

	return { columnsRelatorio };
};
