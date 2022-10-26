import React, { useEffect, useState } from "react";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { useFormik } from "formik";
import { validarAviso } from "./ValidarAviso";
import { Container, Row } from "react-bootstrap";
import ViewsAviso from "./views";

function Avisos() {
	const [isAvisos, setAvisos] = useState([]);

	const formik = useFormik({
		initialValues: {
			id: "",
			titulo: "",
			mensagem: "",
			data_cadastro: "",
		},
	});

	useEffect(() => {
		(async () => {
			try {
				const carga = validarAviso;
				setAvisos(carga);
				for (const i in carga) {
					const nonNullValue = carga[i] === null ? "" : carga[i];
					if (i.indexOf("data_cadastro") !== -1) {
						formik.setFieldValue(i, nonNullValue?.split("T")[0]);
					} else {
						formik.setFieldValue(i, nonNullValue);
					}
				}
			} catch (error) {
				console.error("Error", error);
			}
		})();
	}, []);

	return (
		<>
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<Row>
					<p className="title-consultarCarga">Avisos</p>
					<hr className="w-100" />
				</Row>
				<Row>
					<ViewsAviso formik={formik} isAvisos={isAvisos} />
				</Row>
			</Container>
		</>
	);
}

export default Avisos;
