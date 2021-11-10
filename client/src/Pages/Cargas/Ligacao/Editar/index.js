import React, { useEffect } from "react";
import {
	Container,
	Row,
	Col,
	FloatingLabel,
	Form,
	Button,
} from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import NavbarNavigator from "../../../Components/NavbarNavigator";
import useLoadingScreen from "../../../Components/LoadingScreen";
import swal from "sweetalert";
import ServiceCargas from "../../../../services/ServiceCargas";

function Ligacao() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const history = useHistory();
	const formik = useFormik({
		initialValues: {
			solicitante: "",
			id: id,
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
				const { data } = await ServiceCargas.update(values);
				swal(
					"Sucesso",
					`O registro de id ${data.data.id} foi atualizado`,
					"success"
				);
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	useEffect(() => {
		let isMounted = true;
		setLoading(true);
		ServiceCargas.index({ id })
			.then((response) => {
				const carga = response.data.data;
				for (const i in carga) {
					if (i.indexOf("data") === -1) {
						formik.setFieldValue(i, carga[i]);
					} else {
						formik.setFieldValue(i, carga[i].split("T")[0]);
					}
				}
			})
			.catch(() => {
				history.push("/cargas/menu");
			})
			.finally(() => {
				if (isMounted) {
					setLoading(false);
				}
			});
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<Container className="mb-5 mt-5">
				<Form onSubmit={formik.handleSubmit}>
					<h1 className="mb-5">Edição de carga aberta via ligação</h1>
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
							<Button variant="outline-warning" type="submit" className="p-3">
								Editar
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default Ligacao;
