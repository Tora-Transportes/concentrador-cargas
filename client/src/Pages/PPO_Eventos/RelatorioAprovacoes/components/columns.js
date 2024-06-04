import { Form } from "react-bootstrap";
import {
	FaFileDownload,
	FaFileSignature,
	FaCloudDownloadAlt,
} from "react-icons/fa";

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
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf,
			showFilter: true,
		},
		{
			name: "nome",
			description: "Nome",
			selector: (row) => row.nome,
			showFilter: true,
		},
		{
			name: "filial",
			description: "Filial",
			selector: (row) => row.filial,
			showFilter: true,
		},
		{
			name: "viewed",
			description: "Visto",
			selector: (row) => (row.viewed === 1 ? "Sim" : "Não"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="IS NOT NULL"> Sim </option>
					<option value="IS NULL"> Não </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "signed",
			description: "Assinado",
			selector: (row) => (row.signed === 1 ? "Sim" : "Não"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="IS NOT NULL"> Sim </option>
					<option value="IS NULL"> Não </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "rejected",
			description: "Rejeitado",
			selector: (row) => (row.rejected === 1 ? "Sim" : "Não"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="IS NOT NULL"> Sim </option>
					<option value="IS NULL"> Não </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "link",
			description: "Link para Assinar",
			selector: (row) =>
				row.link === null ? (
					"SEM LINK"
				) : (
					<>
						<FaFileSignature
							size={26}
							onClick={() => {
								window.open(row.link, "_blank");
							}}
						/>
					</>
				),
			showFilter: false,
		},
		{
			name: "file_link_original",
			description: "Link Arquivo Original",
			selector: (row) =>
				row.file_link_original === null ? (
					"SEM LINK"
				) : (
					<>
						<FaFileDownload
							size={26}
							onClick={() => {
								window.open(row.file_link_original, "_blank");
							}}
						/>
					</>
				),
			showFilter: false,
		},
		{
			name: "file_link_signed",
			description: "Link Arquivo Assinado",
			selector: (row) =>
				row.file_link_signed === null ? (
					"SEM LINK"
				) : (
					<>
						<FaCloudDownloadAlt
							size={26}
							onClick={() => {
								window.open(row.file_link_signed, "_blank");
							}}
						/>
					</>
				),
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
