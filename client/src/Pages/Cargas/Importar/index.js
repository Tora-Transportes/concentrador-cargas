import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import NavbarNavigator from "../../Components/NavbarNavigator";
import { BsDownload } from "react-icons/bs";
import swal from "sweetalert";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import * as xlsx from "xlsx";
import TextUtils from "../../Utils/text";
import createSequence from "tooltip-sequence";

function Importar() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [preview, setPreview] = useState([]);
	const [cadastrados, setCadastrados] = useState([]);
	const inputFile = useRef(null);
	async function handleImportCarga(event) {
		event.preventDefault();
		setLoading(true);
		try {
			if (inputFile.current) {
				const files = inputFile.current.files;
				if (files.length === 0) {
					swal("Ops!", "Nenhum arquivo foi selecionado", "error");
				} else if (
					await swal(
						"Ops!",
						"Tem certeza que deseja importar o arquivo selecionado ?",
						"warning",
						{ buttons: ["Não", true], dangerMode: true }
					)
				) {
					const { data } = await ServiceCargas.importSheet({ file: files[0] });
					setCadastrados(data.data);
					await swal(`${data.data.length} registros inseridos`);
					inputFile.current.value = "";
				}
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	function normalizeLocation(location) {
		let output = "BRASIL/" + TextUtils.normalize(location).replace(",", "/");
		while (output.indexOf(" /") !== -1) {
			output = output.replace(" /", "/");
		}
		while (output.indexOf("/ ") !== -1) {
			output = output.replace("/ ", "/");
		}
		return output;
	}

	async function handlePreview() {
		if (inputFile.current?.files?.length) {
			setCadastrados([]);
			const file = inputFile.current.files[0];
			const reader = new FileReader();
			reader.readAsBinaryString(file);
			const sheetJson = await new Promise((resolve) => {
				reader.onload = function (e) {
					const data = e.target.result;
					const workbook = xlsx.read(data, { type: "binary" });
					const sheetNames = workbook.SheetNames;
					const worksheet = workbook.Sheets[sheetNames[0]];
					const json = xlsx.utils.sheet_to_json(worksheet);

					resolve(
						json.map((i) => {
							const tmp = {};
							for (const oldKey of Object.keys(i)) {
								const newKey = TextUtils.normalize(oldKey)
									.toLowerCase()
									.replace(" ", "_");
								tmp[newKey] = i[oldKey];
							}
							return tmp;
						})
					);
				};
			});

			console.log(sheetJson);
			setPreview(sheetJson);
		}
	}

	const options = {
		backdropColor: "#6262625d",
		sequence: [
			{
				element: "#title-import",
				description:
					"<h2>Bem-vindo</h2><div>Add these lines when using in a front end framework.</div>",
				placement: "bottom",
			},
			{
				element: "#botao-download",
				description:
					"<h2>Download de modelo</h2><div>Option to choose the backdrop color.</div>",
				placement: "bottom",
			},
			{
				element: "#import-arq",
				description:
					"<h2>Escolher Arquivo</h2><div>Option to place the tooltip on the top of the element.</div>",
				placement: "top",
			},
			{
				element: "#botao-process",
				description:
					"<h2>Processar</h2><div>Option to place the tooltip on the right of the element.</div>",
				placement: "top",
			},
			{
				element: "#title-tab-import-carg",
				description:
					"<h2>Tabela</h2><div>Option to place the tooltip on the right of the element.</div>",
				placement: "top",
			},
			{
				element: "#Table-impot-carg",
				description:
					"<h2>Tabela Preview e Resultados</h2><div>To install via npm or use the cdn check out this.</div>",
				placement: "top",
			},
		],
		onComplete: function () {
			console.log("Completed!");
		},
	};

	function handleClick(event) {
		event.preventDefault();
		createSequence(options);
	}

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<Container fluid className="text-center mb-5">
				<Row className="p-5 mt-1">
					<h1 onClick={handleClick} id="title-import">
						Importação das cargas
					</h1>
				</Row>
				<Row>
					<a
						href={
							process.env.REACT_APP_STATIC_FILES_URL +
							"/Importação de Carga em Lote.xlsx"
						}
						target="_blank"
						rel="noreferrer"
						className="text-decoration-none"
					>
						<Button variant="outline-primary" id="botao-download">
							Clique aqui para fazer o download da planilha de modelo{" "}
							<BsDownload />
						</Button>
					</a>
				</Row>
				<hr className="mt-5" />
				<Form onSubmit={handleImportCarga} id="import-arq">
					<Row>
						<Col md={10} sm={12}>
							<Form.Group controlId="formFile" className="mb-3">
								<Form.Label></Form.Label>
								<Form.Control
									type="file"
									accept=".xlsx"
									required
									ref={inputFile}
									onChange={handlePreview}
								/>
							</Form.Group>
						</Col>
						<Col className="text-start">
							<Button
								type="submit"
								variant="success"
								className="mt-4"
								id="botao-process"
							>
								Processar
							</Button>
						</Col>
					</Row>
				</Form>

				<h1 className="mt-5" id="title-tab-import-carg">
					Preview e resultados
				</h1>
				<Table responsive striped bordered hover id="Table-impot-carg">
					<thead>
						<tr>
							<th>Código da carga</th>
							<th>Unidade de medida</th>
							<th>Quantidade</th>
							<th>Origem carga</th>
							<th>Destino carga</th>
							<th>Cliente</th>
							<th>É lote ?</th>
							<th>Observação</th>
							<th>Destinatário</th>
						</tr>
					</thead>
					<tbody>
						{cadastrados.length === 0 &&
							preview.map((i, index) => (
								<tr key={index}>
									<td></td>
									<td>{i.unidade}</td>
									<td>{i.quantidade}</td>
									<td>{normalizeLocation(i.origem)}</td>
									<td>{normalizeLocation(i.destino)}</td>
									<td>{i.cliente}</td>
									<td>SIM</td>
									<td>{i.observacao}</td>
									<td>{i.destinatario}</td>
								</tr>
							))}

						{cadastrados.map((i, index) => (
							<tr key={i.id || index}>
								<td>{i.id}</td>
								<td>{i.unidade_medida}</td>
								<td>{i.quantidade}</td>
								<td>{i.origem_carga}</td>
								<td>{i.destino_carga}</td>
								<td>{i.cliente}</td>
								<td>{i.e_lote ? "SIM" : "NÃO"}</td>
								<td>{i.observacao}</td>
								<td>{i.local_coleta}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Container>
		</>
	);
}

export default Importar;
