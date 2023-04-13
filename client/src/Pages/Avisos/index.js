import React, { useEffect, useState } from "react";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { useFormik } from "formik";

import { Container, Row } from "react-bootstrap";
import ViewsAviso from "./views";
import ServiceAvisos from "src/services/ServiceAvisos";

function Avisos() {
	const [dadosAvisos, setDadosAvisos] = useState([]);
	const [atualizarAvisos, setAtualizarAvisos] = useState(false);

	const formik = useFormik({
		initialValues: {
			ID: null,
			TITULO: "",
			MENSAGEM: "",
			AUTOR: "",
			DATA_CADASTRO: "",
			LIKE_ON: null,
			LIKE_OF: null,
		},
	});

	useEffect(() => {
		(async () => {
			try {
				const { data } = (await ServiceAvisos.list()).data;
				localStorage.setItem("viewsAviso", data[0]?.ID);
				setDadosAvisos(data);
			} catch (error) {
				console.error("Error", error);
			}
		})();
		setAtualizarAvisos(false);
	}, [atualizarAvisos]);

	return (
		<>
			<Menusuperior />
			<Container className="container-body-avisos">
				<Row>
					<p className="title-avisos">Avisos</p>
				</Row>
				<Row>
					<ViewsAviso
						formik={formik}
						dadosAvisos={dadosAvisos}
						setDadosAvisos={setDadosAvisos}
						setAtualizarAvisos={setAtualizarAvisos}
					/>
				</Row>
			</Container>
		</>
	);
}

export default Avisos;
