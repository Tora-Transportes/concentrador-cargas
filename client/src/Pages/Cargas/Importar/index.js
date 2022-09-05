import React, { useRef, useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
// import NavbarNavigator from "../../Components/NavbarNavigator";
import { BsDownload } from "react-icons/bs";
import swal from "sweetalert";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import * as xlsx from "xlsx";
import TextUtils from "../../Utils/text";
import HandleClick from "./tooltipsImportar";
import "../Importar/style.css";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

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
					swal("Ops!", "Nenhum arquivo foi selecionado.", "error");
				} else if (
					await swal(
						"Ops!",
						"Tem certeza que deseja importar o arquivo selecionado?",
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

	return (
		<div className="class-body-importCarga">
			<LoadingScreen />
			{/* <NavbarNavigator /> */}
			<Menusuperior />
			<div className="class-container-importar">
				<div className="class-import">
					<div className="title-import">
						<h1 onClick={HandleClick} id="title-import">
							Importação de cargas
						</h1>
					</div>
					<div className="class-button-import">
						<a
							href={
								process.env.REACT_APP_STATIC_FILES_URL +
								"/Importação de Carga em Lote.xlsx"
							}
							target="_blank"
							rel="noreferrer"
						>
							<Button id="botao-download">
								Download planilha modelo <BsDownload />
							</Button>
						</a>
					</div>
				</div>

				<div className="class-input-button" id="import-arq">
					<div>
						<Form.Group controlId="formFile">
							<Form.Label></Form.Label>
							<Form.Control
								id="style-input-arq"
								type="file"
								accept=".xlsx"
								required
								ref={inputFile}
								onChange={handlePreview}
							/>
						</Form.Group>
					</div>
					<div className="class-button-submit">
						<Button
							type="submit"
							id="botao-process"
							onSubmit={handleImportCarga}
						>
							Processar
						</Button>
					</div>
				</div>

				<h1 id="title-tab-import-carg" className="class-title-preview">
					Preview e resultados
				</h1>
				<div className="class-table-importCarga">
					<Table responsive striped bordered hover id="Table-impot-carg">
						<thead>
							<tr>
								<th>Código da carga</th>
								<th>Unidade de medida</th>
								<th>Quantidade</th>
								<th>Origem da carga</th>
								<th>Destino da carga</th>
								<th>Cliente</th>
								<th>É lote?</th>
								<th>Observações</th>
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
				</div>
			</div>
		</div>
	);
}

export default Importar;
