import React, { useEffect, useState } from "react";
import {
	Form,
	FloatingLabel,
	Container,
	Button,
	Row,
	Col,
	Card,
} from "react-bootstrap";
import NavbarNavigator from "../Components/NavbarNavigator";
import ServiceCredenciais from "../../services/ServiceCredenciais";
import { BiBlock, BiCheck } from "react-icons/bi";
import { BsFillTrashFill, BsPencilSquare } from "react-icons/bs";
import { useFormik } from "formik";
import swal from "sweetalert";
import io from "../../services/socket";
export default function Credenciais() {
	const [data, setData] = useState([]);

	useEffect(() => {
		function updateCredenciais(credenciais) {
			const dataOutput = [...data];
			for (const i of credenciais) {
				const credencial = dataOutput.find(
					(j) => j.user === i.user && j.portal === i.portal
				);
				if (credencial) {
					Object.assign(credencial, i);
				} else {
					dataOutput.push(i);
				}
			}
			setData(dataOutput);
		}

		function createCredenciais(credenciais) {
			// console.log(credenciais);
			setData([...data, ...credenciais]);
		}

		function deleteCredenciais(credenciais) {
			const filters = credenciais.map((i) => `${i.user}|${i.portal}`);
			const dataOutput = data.filter(
				(i) => !filters.includes(`${i.user}|${i.portal}`)
			);
			setData(dataOutput);
		}

		io.on("@credenciais-create", createCredenciais);
		io.on("@credenciais-update", updateCredenciais);
		io.on("@credenciais-delete", deleteCredenciais);
		return () => {
			io.off("@credenciais-create");
			io.off("@credenciais-update");
			io.off("@credenciais-delete");
		};
	}, [io, data, setData]);

	useEffect(() => {
		ServiceCredenciais.list().then((response) => {
			setData(response.data);
		});
	}, []);

	const formik = useFormik({
		initialValues: {
			portal: "",
			user: "",
			password: "",
		},
		onSubmit: async (values) => {
			const ok = await swal(
				"Ops ?",
				"Deseja cadastrar essa credencial no portal ?",
				"warning",
				{
					buttons: ["Cancelar", true],
				}
			);

			if (ok) {
				await ServiceCredenciais.create(values);
				swal("Registro inserido");
				setData([
					...data,
					{ ...values, errored: false, successful_attempts: 0 },
				]);
				formik.resetForm();
			} else {
				swal("Nenhuma alteração realizada");
			}
		},
	});

	async function deletarCredencial({ user, portal }, event = null) {
		if (event) {
			event.preventDefault();
		}
		const ok = await swal(
			"Ops ?",
			"Deseja deletar essa credencial ?",
			"warning",
			{
				buttons: ["Cancelar", true],
			}
		);
		if (ok) {
			await ServiceCredenciais.delete({ user, portal });
			swal("Registro removido");
			setData(data.filter((i) => !(i.user === user && i.portal === portal)));
		} else {
			swal("Nenhuma alteração realizada");
		}
	}
	async function mudarSenha(
		{ user, portal, successful_attempts },
		event = null
	) {
		if (event) {
			event.preventDefault();
		}
		const password = await swal(
			"Ops ?",
			"Digite a nova senha para esse portal",
			"warning",
			{
				content: "input",
				buttons: ["Cancelar", true],
			}
		);
		if (password) {
			await ServiceCredenciais.update({
				user,
				portal,
				password,
				errored: false,
				successful_attempts,
			});

			swal("Registro Atualizado");
			setData(
				data.map((i) =>
					i.user === user && i.portal === portal ? { ...i, errored: false } : i
				)
			);
		} else {
			swal("Nenhuma alteração realizada");
		}
	}

	return (
		<>
			<NavbarNavigator />
			<Container>
				<Row>
					{data.map((i) => (
						<Col key={i.portal + i.user}>
							<Card
								className="text-center mt-3 mb-3 mx-auto"
								border="primary"
								style={{ width: "15rem" }}
							>
								<Card.Header>{i.portal}</Card.Header>
								<Card.Body>
									<Card.Title>{i.user}</Card.Title>
									{i.errored ? (
										<BiBlock size="25" className="text-danger" />
									) : (
										<BiCheck size="25" className="text-success" />
									)}
									<Card.Text>
										{i.successful_attempts} Logins realizados
									</Card.Text>
									<div className="d-flex justify-content-around">
										<a
											onClick={(event) => deletarCredencial(i, event)}
											href="#"
										>
											<BsFillTrashFill />
										</a>
										<a onClick={(event) => mudarSenha(i, event)} href="#">
											<BsPencilSquare />
										</a>
									</div>
								</Card.Body>
							</Card>
							{/* <td></td>
						<td></td>
						<td></td>
						<td></td>
						<td ></td> */}
						</Col>
					))}
				</Row>
				<Form onSubmit={formik.handleSubmit}>
					<FloatingLabel controlId="portal" label="Portal" className="mb-3">
						<Form.Control
							value={formik.values.portal}
							onChange={formik.handleChange}
							type="text"
							name="portal"
						/>
					</FloatingLabel>
					<FloatingLabel controlId="usuario" label="Usuário" className="mb-3">
						<Form.Control
							value={formik.values.user}
							onChange={formik.handleChange}
							type="text"
							name="user"
						/>
					</FloatingLabel>
					<FloatingLabel controlId="senha" label="Senha" className="mb-3">
						<Form.Control
							value={formik.values.password}
							onChange={formik.handleChange}
							type="password"
							name="password"
						/>
					</FloatingLabel>
					<Button type="submit">Cadastrar</Button>
				</Form>
			</Container>
		</>
	);
}
