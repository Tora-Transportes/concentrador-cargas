import React from "react";
import Chip from "@material-ui/core/Chip";
import "./style.css";
import { Button, Form } from "react-bootstrap";
import { BsInfoCircle, BsPencilSquare } from "react-icons/bs";
import swal from "sweetalert";
import Swal from "sweetalert2";
import ServiceGMImpendimentos from "src/services/GestaoMultas/ServiceImpedimentos";
import { getClaims } from "../../../../MicrosoftAuthentication";

function formatDateAndHour(date) {
	if (!date) return "";
	const dateObj = new Date(date);
	dateObj.setHours(dateObj.getHours() - 3);
	const day = dateObj.toISOString().split("T")[0];
	const time = dateObj.toISOString().split("T")[1];
	const daysFormatted = day.split("-").reverse().join("/");
	const timeFormatted = time.split(".")[0];

	return `${daysFormatted} ${timeFormatted}`;
}

export const getColumns = (load) => {
	const columnsRelatorio = [
		{
			name: "status",
			description: "Ocorrência",
			selector: (row) => (
				<>
					<Chip
						label={row.status == 4 ? "Impedido" : "Liberado"}
						color="primary"
					></Chip>
				</>
			),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="4">Impedimento transportador </option>
					<option value="5">Liberação transportador</option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "editar",
			description: "Editar",
			static_column: true,
			selector: (row) => (
				<Button
					style={{ backgroundColor: "transparent", borderColor: "transparent" }}
					onClick={() => {
						row.status == 4
							? Swal.fire({
									title: "Liberar Transportador",
									html: `
							  <p><strong>Motorista:</strong> ${row.nome_motorista}</p>
							  <p><strong>CPF:</strong> ${row.cpf}</p>
							  <p><strong>AIT:</strong> ${row.ait}</p>
							  <textarea id="observacao" class="swal2-input" placeholder="Digite a sua observação aqui..." rows="6" style="text-align: left; width: 100%; min-height: 100px;"></textarea>
							`,
									showCancelButton: true,
									confirmButtonText: "Atualizar",
									cancelButtonText: "Cancelar",
									preConfirm: () => {
										const observacao =
											document.getElementById("observacao").value;
										if (!observacao) {
											Swal.showValidationMessage(
												"Por favor, digite uma observação."
											);
											return false;
										}
										return observacao;
									},
							  }).then(async (result) => {
									if (result.isConfirmed) {
										await ServiceGMImpendimentos.update(row.id, {
											status: 5,
											cod_user_update: String(getClaims().name),
											observacao: result.value,
										});
										await load();
										Swal.fire(
											"Atualizado!",
											`Observação: ${result.value}`,
											"success"
										);
									}
							  })
							: Swal.fire(
									"Atenção",
									"Já foi solicitado a liberação do condutor",
									"info"
							  );
					}}
				>
					<BsPencilSquare style={{ color: "#00652E" }} size={18} />
				</Button>
			),
		},
		{
			name: "nome_motorista",
			description: "Motorista",
			selector: (row) => row.nome_motorista,
			showFilter: true,
		},
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf,
			showFilter: true,
		},
		{
			name: "ait",
			description: "AIT",
			selector: (row) => row.ait,
			showFilter: false,
		},
		{
			name: "empresa",
			description: "Empresa",
			selector: (row) => row.empresa,
			showFilter: true,
		},
		{
			name: "placa",
			description: "Placa",
			selector: (row) => row.placa,
			showFilter: true,
		},
		{
			name: "processado",
			description: "Processado",
			selector: (row) => (row.processado == 1 ? "Sim" : "Não"),
			showFilter: false,
		},
		{
			name: "observacao",
			description: "Observação",
			selector: (row) => (
				<Button
					variant="outline-primary"
					onClick={(e) => {
						e.preventDefault();
						swal(row.observacao ?? "Sem Informações");
					}}
				>
					<BsInfoCircle className="icon-info" />
					Info
				</Button>
			),
			showFilter: false,
		},
		{
			name: "created_at",
			description: "Criado em",
			selector: (row) => formatDateAndHour(row.created_at),
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
