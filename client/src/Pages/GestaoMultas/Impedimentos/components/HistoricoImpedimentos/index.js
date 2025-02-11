import React from "react";
import { Button } from "react-bootstrap";
import { BsInfoCircle } from "react-icons/bs";
import Swal from "sweetalert2";
import ServiceGMImpendimentos from "../../../../../services/GestaoMultas/ServiceImpedimentos";

const HistoricoImpedimentos = ({ cpf }) => {
	const itemsPerPage = 5; // Número de itens por página

	const fetchData = async () => {
		try {
			const response = await ServiceGMImpendimentos.historico({ cpf });
			return response.data; // Retorna os dados carregados
		} catch (error) {
			Swal.fire("Erro ao carregar os dados", error.message, "error");
			return [];
		}
	};

	const showModal = async () => {
		const loadedData = await fetchData(); // Aguarda os dados carregarem
		if (loadedData.length === 0) {
			Swal.fire("Nenhum dado disponível", "", "info");
			return;
		}

		renderTable(1, loadedData); // Agora já temos os dados disponíveis
	};

	const renderTable = (page, tableData) => {
		const totalPages = Math.ceil(tableData.length / itemsPerPage);
		const startIndex = (page - 1) * itemsPerPage;
		const paginatedData = tableData.slice(
			startIndex,
			startIndex + itemsPerPage
		);

		const tableHtml = `
			<table class="w-full border-collapse border border-gray-300 text-left">
				<thead>
					<tr class="bg-gray-200">
						<th class="p-2 border">Status</th>
						<th class="p-2 border">Descrição</th>
						<th class="p-2 border">Nome</th>
						<th class="p-2 border">Data</th>
					</tr>
				</thead>
				<tbody>
					${paginatedData
						.map(
							(item) => `
							<tr>
								<td class="p-2 border">${item.STATUS}</td>
								<td class="p-2 border">${item.DESCRICAO}</td>
								<td class="p-2 border">${item.NOME}</td>
								<td class="p-2 border">${new Date(item.DATA).toLocaleString()}</td>
							</tr>
						`
						)
						.join("")}
				</tbody>
			</table>
			<div style="display: flex; justify-content: space-between; margin-top: 10px;">
				<button id="prevPage" ${page === 1 ? "disabled" : ""} 
					style="padding: 5px 10px; border: 1px solid #ccc; background-color: #f8f9fa; cursor: pointer;">
					Anterior
				</button>
				<span>Página ${page} de ${totalPages}</span>
				<button id="nextPage" ${page === totalPages ? "disabled" : ""} 
					style="padding: 5px 10px; border: 1px solid #ccc; background-color: #f8f9fa; cursor: pointer;">
					Próxima
				</button>
			</div>
		`;

		Swal.fire({
			title: "Lista de Dados",
			html: tableHtml,
			width: "80%",
			showCloseButton: true,
			showConfirmButton: false,
			didOpen: () => {
				document.getElementById("prevPage")?.addEventListener("click", () => {
					renderTable(page - 1, tableData);
				});
				document.getElementById("nextPage")?.addEventListener("click", () => {
					renderTable(page + 1, tableData);
				});
			},
		});
	};

	return (
		<Button variant="outline-primary" onClick={showModal}>
			<BsInfoCircle className="icon-info" />
			Histórico
		</Button>
	);
};

export default HistoricoImpedimentos;
