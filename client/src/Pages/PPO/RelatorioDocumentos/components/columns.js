import { Form } from "react-bootstrap";
import {
	FaFileDownload,
	FaFileSignature,
	FaCloudDownloadAlt,
} from "react-icons/fa";

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf,
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
			name: "mes",
			description: "Mês",
			selector: (row) => row.mes,
			showFilter: true,
		},
		{
			name: "ano",
			description: "Ano",
			selector: (row) => row.ano,
			showFilter: true,
		},
	];

	return { columnsRelatorio };
};
