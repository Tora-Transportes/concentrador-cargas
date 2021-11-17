import React, { useEffect, useState } from "react";
import {
	Container,
	Row,
	Col,
	ListGroup,
	FormControl,
	InputGroup,
	Button,
	Form,
} from "react-bootstrap";
import { useFormik } from "formik";
import NavbarNavigator from "../Components/NavbarNavigator";
import ServiceProdutos from "../../services/ServiceProdutos";
import { MdAddCircleOutline } from "react-icons/md";
import swal from "sweetalert";
import { getClaims } from "../../MicrosoftAuthentication";
import useLoadingScreen from "../Components/LoadingScreen";

function Produtos() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [produtos, setProdutos] = useState([]);
	const formik = useFormik({
		initialValues: {
			nome: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const produto = (await ServiceProdutos.create(values)).data.data;
				const username = getClaims().name;
				setProdutos([{ ...produto, usuario: username }, ...produtos]);
				swal("Sucesso!", "O tipo de material foi cadastrado com sucesso");
				formik.resetForm();
			} catch (error) {
				console.log(error);
			}

			setLoading(false);
		},
	});

	useEffect(() => {
		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});
	}, []);

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<Container className="text-center mb-5 mt-5">
				<Row>
					<Form onSubmit={formik.handleSubmit}>
						<InputGroup className="mb-2">
							<Button variant="outline-info" type="submit">
								<MdAddCircleOutline />
							</Button>
							<FormControl
								name="nome"
								onChange={formik.handleChange}
								value={formik.values.nome}
								placeholder=". . ."
							/>
						</InputGroup>
					</Form>
				</Row>

				<Row className="mt-1">
					<Col>
						<ListGroup as="ol">
							<Row>
								{produtos.map((i) => (
									<Col md={3} sm={4} key={i.id}>
										<ListGroup.Item as="li">{i.nome}</ListGroup.Item>
									</Col>
								))}
							</Row>
						</ListGroup>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Produtos;
