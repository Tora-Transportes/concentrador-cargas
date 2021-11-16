import React, { useState } from "react";
import {
	Container,
	Row,
	Col,
	ListGroup,
	Form,
	FormControl,
	InputGroup,
} from "react-bootstrap";
import { useFormik } from "formik";
import NavbarNavigator from "../../Components/NavbarNavigator";
import ServiceUsuarios from "../../../services/ServiceUsuarios";
import useDebouncedFunction from "../../Components/useDebounceFunction";
import { BsSearch } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import swal from "sweetalert";
function Permissoes() {
	const [users, setUsers] = useState([]);

	const formik = useFormik({
		initialValues: {
			query: "",
			permissao_deletar_cargas: false,
			permissao_alterar_permissoes: false,
			permissao_cadastrar_produtos: false,
		},
	});

	function handleChangeCheckbox(event) {
		const { name, checked } = event.target;
		formik.setFieldValue(name, checked);
	}

	useDebouncedFunction(
		function () {
			ServiceUsuarios.search({ q: formik.values.query }).then((response) => {
				setUsers(response.data.data.results);
			});
		},
		formik.values.query,
		500
	);

	async function handleSavePermissions(oid) {
		const permissoes = [];
		if (formik.values.permissao_deletar_cargas) {
			permissoes.push("DELETAR_CARGAS");
		}
		if (formik.values.permissao_alterar_permissoes) {
			permissoes.push("ALTERAR_PERMISSOES");
		}
		if (formik.values.permissao_cadastrar_produtos) {
			permissoes.push("CADASTRAR_PRODUTOS");
		}
		if (
			await swal(
				"👀",
				"Certeza que deseja aplicar essas permissões para o usuário ?",
				"warning",
				{
					buttons: ["Não", true],
				}
			)
		) {
			await ServiceUsuarios.changePermissions({ oid, permissoes });
			swal("Sucesso", "Permissões alteradas", "success");
		}
	}

	return (
		<>
			<NavbarNavigator />
			<Container className="text-center mb-5 mt-5">
				<Row>
					<Col>
						<Form.Check
							type="checkbox"
							name="permissao_deletar_cargas"
							checked={formik.values.permissao_deletar_cargas}
							onChange={handleChangeCheckbox}
							label={`Deletar cargas`}
							id="permissao_deletar_cargas"
							inline
						/>
						<Form.Check
							type="checkbox"
							name="permissao_alterar_permissoes"
							checked={formik.values.permissao_alterar_permissoes}
							onChange={handleChangeCheckbox}
							label={`Alterar permissões`}
							id="permissao_alterar_permissoes"
							inline
						/>
						<Form.Check
							type="checkbox"
							name="permissao_cadastrar_produtos"
							checked={formik.values.permissao_cadastrar_produtos}
							onChange={handleChangeCheckbox}
							label={`Cadastrar produtos`}
							id="permissao_cadastrar_produtos"
							inline
						/>
					</Col>
				</Row>
				<Row>
					<InputGroup className="mb-2">
						<InputGroup.Text>
							<BsSearch />
						</InputGroup.Text>
						<FormControl
							name="query"
							onChange={formik.handleChange}
							value={formik.values.query}
							placeholder="..."
						/>
					</InputGroup>
				</Row>
				<Row className="mt-1">
					<Col>
						<ListGroup as="ol">
							{users.map((i) => (
								<ListGroup.Item as="li" key={i.oid}>
									{i.nome} - <strong>{i.email}</strong> -{" "}
									<FaRegSave onClick={() => handleSavePermissions(i.oid)} />
								</ListGroup.Item>
							))}
						</ListGroup>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Permissoes;
