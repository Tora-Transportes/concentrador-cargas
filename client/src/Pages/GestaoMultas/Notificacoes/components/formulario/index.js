import React from "react";
import { Form, Row, Col, FloatingLabel } from "react-bootstrap";
import "./style.css";

function FormularioEmpresa({ formik }) {
	return (
		<div className="class-body-form">
			<Row>
				<Col>
					<FloatingLabel label="Cod. Empresa" className="mb-3">
						<Form.Control
							id="id"
							type="text"
							placeholder=" "
							name="id"
							value={formik.values.id}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel label="Nome Empresa" className="mb-3">
						<Form.Control
							id="nome"
							type="text"
							placeholder=" "
							name="nome"
							value={formik.values.nome}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel label="Token" className="mb-3">
						<Form.Control
							id="token"
							type="text"
							placeholder=" "
							name="token"
							value={formik.values.token}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel label="Responsável Cadastro" className="mb-3">
						<Form.Control
							id="cod_usu_create"
							type="text"
							placeholder=" "
							name="cod_usu_create"
							value={formik.values.cod_usu_create}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Data Cadastro" className="mb-3">
						<Form.Control
							id="created_at"
							type="text"
							placeholder=" "
							name="created_at"
							value={formik.values.created_at}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel label="Responsável Atualização" className="mb-3">
						<Form.Control
							id="cod_usu_update"
							type="text"
							placeholder=" "
							name="cod_usu_update"
							value={formik.values.cod_usu_update}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Data Atualização" className="mb-3">
						<Form.Control
							id="updated_at"
							type="text"
							placeholder=" "
							name="updated_at"
							value={formik.values.updated_at}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>
		</div>
	);
}

export default FormularioEmpresa;
