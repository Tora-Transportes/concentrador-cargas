import React from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import swal from "sweetalert";
import ServiceEmpresas from "src/services/GestaoMultas/ServiceEmpresas";

async function handleDelete(notify, nome, id) {
	const observacao = await swal(
		"Ops!",
		`Tem certeza que deseja DELETAR a empresa ${nome}?`,
		"warning",
		{
			buttons: ["Não", true],
		}
	);
	if (observacao) {
		try {
			await ServiceEmpresas.delete(id);
			swal("Sucesso", "Empresa deletada!", "success");
			await notify();
		} catch (error) {
			console.log(error);
		}
	}
}

export const getColumns = (notify) => {
	const columnsRelatorio = [
		{
			name: "id",
			description: "Cod. Empresa",
			selector: (row) => row.id,
			showFilter: false,
		},
		{
			name: "nome",
			description: "Nome",
			selector: (row) => row.nome,
			showFilter: true,
		},
		{
			name: "token",
			description: "Token",
			selector: (row) => row.token,
			showFilter: false,
		},
		{
			name: "editar",
			description: "Editar",
			static_column: true,
			selector: (row) => (
				<Button
					style={{ backgroundColor: "transparent", borderColor: "transparent" }}
					onClick={() => {
						window.open(`/gestao-multas/empresas/${row.id}`, "_blank");
					}}
				>
					<BsPencilSquare style={{ color: "#00652E" }} size={18} />
				</Button>
			),
		},
		{
			name: "excluir",
			description: "Excluir",
			static_column: true,
			selector: (row) => (
				<Button
					style={{ backgroundColor: "transparent", borderColor: "transparent" }}
					onClick={() => {
						handleDelete(notify, row.nome, row.id);
					}}
				>
					<MdDelete style={{ color: "#D12929FF" }} size={22} />
				</Button>
			),
		},
	];

	return { columnsRelatorio };
};
