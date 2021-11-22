import React, { useEffect, useState } from "react";
import {
	Container,
	Row,
	Col,
	ListGroup,
	InputGroup,
	Button,
	Form,
	Table,
	FormControl,
} from "react-bootstrap";
import { useFormik } from "formik";
import NavbarNavigator from "../Components/NavbarNavigator";
import ServiceProdutos from "../../services/ServiceProdutos";
import { MdAddCircleOutline } from "react-icons/md";
import swal from "sweetalert";
import { getClaims } from "../../MicrosoftAuthentication";
import useLoadingScreen from "../Components/LoadingScreen";

import { BsPencilSquare, BsTrash, BsCheckLg } from "react-icons/bs";

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
				const atualizacao = [
					...produtos,
					{ ...produto, usuario: username, ativo: 1 },
				].sort((a, b) => (a.nome < b.nome ? -1 : 1));
				setProdutos(atualizacao);
				swal("Sucesso!", "O tipo de material foi cadastrado", "success");
				formik.resetForm();
			} catch (error) {
				console.log(error);
			}

			setLoading(false);
		},
	});

	async function handleDelete(id) {
		const ok = await swal(
			"Ops?",
			`Tem certeza que deseja desabilitar o produto ${id}`,
			"warning",
			{
				buttons: ["Não", true],
			}
		);
		if (ok) {
			try {
				await ServiceProdutos.delete({ id });
				swal("Sucesso", "Produto desabilitado", "success");
				setProdutos((p) =>
					p.map((i) => {
						if (i.id !== id) return i;
						return { ...i, ativo: 0 };
					})
				);
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function handleEnableProduto(id) {
		try {
			await ServiceProdutos.enable({ id });
			swal("Sucesso", "Produto ativado", "success");
			setProdutos((p) =>
				p.map((i) => {
					if (i.id !== id) return i;
					return { ...i, ativo: 1 };
				})
			);
		} catch (error) {
			console.log(error);
		}
	}

	async function handleEditProduto(id) {
		const produto = await swal(`Novo nome para o produto '${id}'`, {
			content: "input",
			buttons: ["Cancelar", true],
		});
		if (produto === null) {
			return;
		}
		if (!produto) {
			return swal("Nenhum dado foi atualizado");
		}

		try {
			await ServiceProdutos.update({ nome: produto, id });
			swal("Sucesso!", "Produto atualizado", "success");
			setProdutos((p) =>
				p
					.map((i) => {
						if (i.id !== id) return i;
						return { ...i, nome: produto };
					})
					.sort((a, b) => (a.nome > b.nome ? 1 : -1))
			);
		} catch (error) {
			console.log(error);
		}
	}

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
								list="nome_produtos"
							/>
							<datalist id="nome_produtos">
								{produtos.map((i) => (
									<option key={i.nome}>{i.nome}</option>
								))}
							</datalist>
						</InputGroup>
					</Form>
				</Row>

				<Row className="mt-1">
					<Col>
						<ListGroup as="ol">
							<Row>
								<Table>
									<thead>
										<tr>
											<th>Nome</th>
											<th>Atualizado Por:</th>
											<th>Situação</th>
											<th>Ações</th>
										</tr>
									</thead>
									<tbody>
										{produtos.map((i) => (
											<tr key={i.id}>
												<td>{i.nome}</td>
												<td>{i.usuario}</td>
												<td>{i.ativo ? "Ativo" : "Desativado"}</td>
												<td>
													<a href="">
														<BsPencilSquare
															onClick={(e) => {
																e.preventDefault();
																handleEditProduto(i.id);
															}}
														/>
													</a>{" "}
													{!!i.ativo && (
														<a href="">
															<BsTrash
																onClick={(e) => {
																	e.preventDefault();
																	handleDelete(i.id);
																}}
															/>
														</a>
													)}{" "}
													{!i.ativo && (
														<a href="">
															<BsCheckLg
																onClick={(e) => {
																	e.preventDefault();
																	handleEnableProduto(i.id);
																}}
															/>
														</a>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</Row>
						</ListGroup>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Produtos;
