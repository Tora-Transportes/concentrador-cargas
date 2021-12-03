import React, { useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import NavbarNavigator from "../../Components/NavbarNavigator";
import { BsDownload } from "react-icons/bs";
import swal from "sweetalert";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";

function Importar() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
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
					await swal(`${data.data.length} registros inseridos`);
					inputFile.current.value = "";
				}
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<Container className="text-center mb-5">
				<Row className="p-5 mt-1">
					<h1>Importação das cargas</h1>
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
						<Button variant="outline-primary">
							Clique aqui para fazer o download da planilha de modelo{" "}
							<BsDownload />
						</Button>
					</a>
				</Row>
				<hr className="mt-5" />
				<Form onSubmit={handleImportCarga}>
					<Row>
						<Col md={10} sm={12}>
							<Form.Group controlId="formFile" className="mb-3">
								<Form.Label></Form.Label>
								<Form.Control
									type="file"
									accept=".xlsx"
									required
									ref={inputFile}
								/>
							</Form.Group>
						</Col>
						<Col className="text-start">
							<Button type="submit" variant="success" className="mt-4">
								Processar
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default Importar;
