import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Table, Button, Spinner, Row } from "react-bootstrap";
import ServiceGMDocumentos from "../../../../services/GestaoMultas/ServiceDocumentos";
import { getClaims } from "../../../../MicrosoftAuthentication";
import { formatDateAtual } from "src/Pages/Utils/formatDate";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { RiFileAddFill } from "react-icons/ri";
import PaginatedTableDocumentsLogs from "../DocumentsLogsComponent";

const DocumentosGMList = ({ ait }) => {
	const isMobile = useMediaQuery("(max-width:800px)");
	const [documentos, setDocumentos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingItem, setLoadingItem] = useState(null);
	const [logs, setLogs] = useState([]); // Armazena os logs

	const fetchDocumentos = async () => {
		setLoading(true);
		try {
			const [documentosResponse, logsResponse] = await Promise.all([
				ServiceGMDocumentos.listByAit(ait),
				ServiceGMDocumentos.logs(ait),
			]);
			setDocumentos(documentosResponse.data); // Ajuste caso a resposta esteja em 'data'
			setLogs(logsResponse.data); // Ajuste caso a resposta esteja em 'data'
		} catch (error) {
			Swal.fire("Erro", "Não foi possível carregar os documentos", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (ait) fetchDocumentos();
	}, [ait]);

	const handleDelete = async (id) => {
		const { value: confirmDelete } = await Swal.fire({
			title: "Tem certeza?",
			text: "Você deseja excluir este documento?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sim, excluir",
			cancelButtonText: "Cancelar",
		});

		if (confirmDelete) {
			try {
				setLoadingItem(id);
				await ServiceGMDocumentos.delete(id, String(getClaims().name));
				fetchDocumentos();
				Swal.fire(
					"Deletado!",
					"O documento foi excluído com sucesso.",
					"success"
				);
			} catch (error) {
				Swal.fire("Erro", "Ocorreu um erro ao excluir o documento", "error");
			} finally {
				setLoadingItem(null);
			}
		}
	};

	const handleDownload = async (id, nome, extensao) => {
		try {
			setLoadingItem(id);
			const response = await ServiceGMDocumentos.download(id);
			const blob = new Blob([response.data], {
				type: "application/octet-stream",
			});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${nome}.${extensao}`;
			a.click();
			Swal.fire("Sucesso", "O documento está sendo baixado", "success");
		} catch (error) {
			Swal.fire("Erro", "Não foi possível baixar o documento", "error");
		} finally {
			setLoadingItem(null);
		}
	};

	const handleAddDocument = async () => {
		const { value: formData } = await Swal.fire({
			title: "Adicionar Novo Documento",
			html: `
            <input 
              type="file" 
              id="swal-input-arquivo" 
              class="swal2-input swal-input-file" 
              style="padding: 10px; border-radius: 5px; width: 100%; max-width: 400px; box-sizing: border-box; display: block; margin: 0 auto;"
            />
          `,
			preConfirm: () => {
				const arquivo = document.getElementById("swal-input-arquivo").files[0];

				if (!arquivo) {
					Swal.showValidationMessage("Por favor, selecione um arquivo");
					return false;
				}

				const fileName = arquivo.name;
				const fileExtension = fileName.split(".").pop();
				const nome = fileName.split(".")[0];

				return { nome, extensao: fileExtension, arquivo };
			},
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: "Adicionar",
			cancelButtonText: "Fechar",
			customClass: {
				popup: "swal-popup-custom",
			},
		});

		if (formData) {
			const { nome, extensao, arquivo } = formData;
			const formDataToSend = new FormData();

			formDataToSend.append("ait", ait);
			formDataToSend.append("cod_user_created", String(getClaims().name));
			formDataToSend.append("nome", nome);
			formDataToSend.append("extensao", extensao);
			formDataToSend.append("arquivo", arquivo);
			try {
				await ServiceGMDocumentos.create(formDataToSend);
				Swal.fire("Sucesso", "Documento criado com sucesso!", "success");
				fetchDocumentos();
			} catch (error) {
				Swal.fire("Erro", "Erro ao criar o documento", "error");
			}
		}
	};

	return (
		<>
			<Row style={{ marginTop: "40px" }}>
				<div
					style={{
						display: "flex",
						flexDirection: isMobile ? "column" : "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div style={{ marginBottom: "20px" }}>
						<h4>Documentos</h4>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: isMobile ? "column" : "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Button
							variant="success"
							onClick={handleAddDocument}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.5rem",
								marginBottom: "0px",
							}}
						>
							<RiFileAddFill size={20} />
							Adicionar Documento
						</Button>
					</div>
				</div>
				<hr />
				{loading && (
					<div className="text-center">
						<Spinner animation="border" variant="primary" />
					</div>
				)}

				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Nome</th>
							<th>Extensão</th>
							<th>Criado Por</th>
							<th>Data Criação</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody>
						{documentos.map((documento) => (
							<tr key={documento.id}>
								<td>{documento.nome}</td>
								<td>{documento.extensao}</td>
								<td>{documento.cod_user_created}</td>
								<td>{formatDateAtual(documento.created_at)}</td>
								<td>
									{loadingItem === documento.id ? (
										<div role="status" aria-live="polite">
											<Spinner animation="border" size="sm" variant="primary" />
										</div>
									) : (
										<>
											<Button
												variant="primary"
												onClick={() =>
													handleDownload(
														documento.id,
														documento.nome,
														documento.extensao
													)
												}
											>
												Baixar
											</Button>{" "}
											<Button
												variant="danger"
												onClick={() => handleDelete(documento.id)}
											>
												Deletar
											</Button>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Row>
			<Row>
				<div
					style={{
						display: "flex",
						flexDirection: isMobile ? "column" : "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div style={{ marginBottom: "20px" }}>
						<h4>Histórico Documentos</h4>
					</div>
				</div>
				<hr />
				<PaginatedTableDocumentsLogs
					logs={logs}
					loading={loading}
				></PaginatedTableDocumentsLogs>
			</Row>
		</>
	);
};

export default DocumentosGMList;
