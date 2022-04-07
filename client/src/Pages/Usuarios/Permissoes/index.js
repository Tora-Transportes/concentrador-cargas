import React, { useState } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	FormControl,
	InputGroup,
	Table,
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
			permissao_aprovar_veiculos: false,
			permissao_aprovar_viagem: false,
			permissao_vincular_placa: false,
			permissao_registrar_justificativa: false,
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
		if (formik.values.permissao_aprovar_veiculos) {
			permissoes.push("APROVAR_VEICULOS");
		}
		if (formik.values.permissao_aprovar_viagem) {
			permissoes.push("APROVAR_VIAGEM");
		}
		if (formik.values.permissao_vincular_placa) {
			permissoes.push("VINCULAR_PLACA");
		}
		if (formik.values.permissao_registrar_justificativa) {
			permissoes.push("REGISTRAR_JUSTIFICATIVA");
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
			setUsers((old) =>
				old.map((i) => {
					if (i.oid === oid) {
						return { ...i, permissoes: permissoes };
					}
					return i;
				})
			);
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
						<Form.Check
							type="checkbox"
							name="permissao_aprovar_veiculos"
							checked={formik.values.permissao_aprovar_veiculos}
							onChange={handleChangeCheckbox}
							label={`Aprovar veículos`}
							id="permissao_aprovar_veiculos"
							inline
						/>
						<Form.Check
							type="checkbox"
							name="permissao_aprovar_viagem"
							checked={formik.values.permissao_aprovar_viagem}
							onChange={handleChangeCheckbox}
							label={`Aprovar viagem`}
							id="permissao_aprovar_viagem"
							inline
						/>
						<Form.Check
							type="checkbox"
							name="permissao_vincular_placa"
							checked={formik.values.permissao_vincular_placa}
							onChange={handleChangeCheckbox}
							label={`Vincular placa`}
							id="permissao_vincular_placa"
							inline
						/>
						<Form.Check
							type="checkbox"
							name="permissao_registrar_justificativa"
							checked={formik.values.permissao_registrar_justificativa}
							onChange={handleChangeCheckbox}
							label={`Registrar Justificativa`}
							id="permissao_registrar_justificativa"
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
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Nome</th>
									<th>Email</th>
									<th>Permissões</th>
									<th>Aplicar permissão</th>
								</tr>
							</thead>
							<tbody>
								{users.map((i) => (
									<tr key={i.oid}>
										<td>{i.nome}</td>
										<td>{i.email}</td>
										<td>
											{i.permissoes.map((j) => (
												<span key={i.oid + j} className="fw-bold">
													{j}
													<br />
												</span>
											))}
										</td>
										<td>
											<FaRegSave onClick={() => handleSavePermissions(i.oid)} />
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Permissoes;
