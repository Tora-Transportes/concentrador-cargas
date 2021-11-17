import React from "react";
import { FloatingLabel, Form, Modal, Button } from "react-bootstrap";
import { useFormik } from "formik";

function useFilterCargas() {
	const formik = useFormik({
		initialValues: {
			show: true,
			id: "",
			cliente: "",
			e_lote: "",
			data_entrega: "",
			data_coleta: "",
			tipo_carga: "",
			responsavel_cadastro: "",
			data_cadastro: "",
		},
	});

	return { formikFilter: formik };
}

export const CargaFilter = ({ formik, onFilter }) => {
	function getValues() {
		const values = {};
		for (const i in formik.values) {
			if (i === "show") continue;
			if (!["", null, undefined].includes(formik.values[i])) {
				values[i] = formik.values[i];
				if (i === "e_lote") {
					values[i] = Number(formik.values[i]);
				}
			}
		}
		return values;
	}
	return (
		<Modal
			size="lg"
			show={formik.values.show}
			onHide={() => {
				formik.setFieldValue("show", false);
				onFilter(getValues());
			}}
			aria-labelledby="example-modal-sizes-title-lg"
		>
			<Modal.Header closeButton>
				<Modal.Title id="example-modal-sizes-title-lg">
					<Button onClick={formik.handleReset}>Limpar filtro</Button>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					className="mt-4 mb-5"
					onSubmit={(e) => {
						e.preventDefault();
						onFilter(getValues());
					}}
				>
					<FloatingLabel label="ID">
						<Form.Control
							type="text"
							placeholder=" "
							onChange={formik.handleChange}
							value={formik.values.id}
							name="id"
						/>
					</FloatingLabel>

					<FloatingLabel label="Cliente">
						<Form.Control
							type="text"
							placeholder=" "
							onChange={formik.handleChange}
							value={formik.values.cliente}
							name="cliente"
						/>
					</FloatingLabel>

					<FloatingLabel label="Responsável pelo cadastro">
						<Form.Control
							type="text"
							placeholder=" "
							onChange={formik.handleChange}
							value={formik.values.responsavel_cadastro}
							name="responsavel_cadastro"
						/>
					</FloatingLabel>

					<FloatingLabel label="Tipo material">
						<Form.Control
							type="text"
							placeholder=" "
							onChange={formik.handleChange}
							value={formik.values.tipo_carga}
							name="tipo_carga"
						/>
					</FloatingLabel>

					<FloatingLabel label="Data de coleta">
						<Form.Control
							type="date"
							placeholder=" "
							onChange={formik.handleChange}
							value={formik.values.data_coleta}
							name="data_coleta"
						/>
					</FloatingLabel>

					<FloatingLabel label="Data de entrega">
						<Form.Control
							type="date"
							placeholder=" "
							onChange={formik.handleChange}
							value={formik.values.data_entrega}
							name="data_entrega"
						/>
					</FloatingLabel>

					<FloatingLabel label="Data cadastro">
						<Form.Control
							type="date"
							placeholder=" "
							onChange={formik.handleChange}
							value={formik.values.data_cadastro}
							name="data_cadastro"
						/>
					</FloatingLabel>

					<FloatingLabel label="É lote ?">
						<Form.Select
							placeholder=" "
							value={formik.values.e_lote}
							onChange={formik.handleChange}
							name="e_lote"
						>
							<option value=""></option>
							<option value="1">Sim</option>
							<option value="0">Não</option>
						</Form.Select>
					</FloatingLabel>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default useFilterCargas;
