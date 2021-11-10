import React from "react";
import {
	Container,
	Row,
	Col,
	FloatingLabel,
	Form,
	Button,
} from "react-bootstrap";
import { useFormik } from "formik";
import NavbarNavigator from "../../../Components/NavbarNavigator";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ServiceCargas from "../../../../services/ServiceCargas";
import swal from "sweetalert";

function Ligacao() {
	const [LoadingScreen, setLoading] = useLoadingScreen();

	function resetForm() {
		formik.resetForm();
		formik.setFieldValue("id", "L-" + new Date().getTime());
	}

	const formik = useFormik({
		initialValues: {
			solicitante: "",
			id: "L-" + new Date().getTime(),
			e_cotado: false,
			cliente: "",
			destino_carga: "",
			origem_carga: "",
			data_coleta: "",
			data_entrega: "",
			tipo_carga: "",
			peso: "",
			observacao: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceCargas.create({
					...values,
					canal_comunicacao: "ligacao",
				});
				swal(
					"Sucesso",
					`A carga foi cadastrada com o identificador ${data.data.id}`,
					"success"
				);
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
			resetForm();
		},
	});

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<Container className="mb-5 mt-5">
				<Form onSubmit={formik.handleSubmit}>
					<h1 className="mb-5">Cadastro de carga via ligação</h1>
					<Row>
						<Col>
							<FloatingLabel label="Solicitante" className="mb-3">
								<Form.Control
									type="text"
									placeholder=" "
									name="solicitante"
									value={formik.values.solicitante}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col md={4} sm={12}>
							<FloatingLabel label="Código da carga" className="mb-3">
								<Form.Control
									type="text"
									placeholder=" "
									disabled
									name="id"
									value={formik.values.id}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Group className="mb-3">
								<Form.Check
									type="checkbox"
									label="Cota ?"
									onChange={(e) =>
										formik.setFieldValue("e_cotado", e.target.checked)
									}
									checked={formik.values.e_cotado}
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col>
							<FloatingLabel label="Cliente" className="mb-3">
								<Form.Control
									type="text"
									placeholder=" "
									name="cliente"
									value={formik.values.cliente}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<FloatingLabel label="Origem carga" className="mb-3">
								<Form.Control
									type="text"
									placeholder=" "
									name="origem_carga"
									value={formik.values.origem_carga}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="Destino carga" className="mb-3">
								<Form.Control
									type="text"
									placeholder=" "
									name="destino_carga"
									value={formik.values.destino_carga}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>
					<Row>
						<Col>
							<FloatingLabel label="Coleta" className="mb-3">
								<Form.Control
									type="date"
									placeholder=" "
									name="data_coleta"
									value={formik.values.data_coleta}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="Entrega" className="mb-3">
								<Form.Control
									type="date"
									placeholder=" "
									name="data_entrega"
									value={formik.values.data_entrega}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<FloatingLabel label="Tipo material" className="mb-3">
								<Form.Control
									type="text"
									placeholder=" "
									name="tipo_carga"
									value={formik.values.tipo_carga}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="Quantidade (KG)" className="mb-3">
								<Form.Control
									type="number"
									min={1}
									step={0.000000000001}
									placeholder=" "
									name="peso"
									value={formik.values.peso}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>

					<Row>
						<Col>
							<Form.Group className="mb-3">
								<Form.Label>Observações</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									name="observacao"
									value={formik.values.observacao}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col>
							<Button variant="outline-success" type="submit" className="p-3">
								Cadastrar
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default Ligacao;
