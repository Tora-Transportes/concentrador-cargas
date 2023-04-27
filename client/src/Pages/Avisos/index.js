import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useFormik } from "formik";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import ViewsAviso from "./views";
import ServiceAvisos from "src/services/ServiceAvisos";

function Avisos() {
	const [dadosAvisos, setDadosAvisos] = useState([]);
	const [atualizarAvisos, setAtualizarAvisos] = useState(false);
	const [ativarRefresh, setAtivarRefresh] = useState(true);

	const formik = useFormik({
		initialValues: {
			ID: null,
			TITULO: "",
			MENSAGEM: "",
			AUTOR: "",
			DATA_CADASTRO: "",
			LIKE_ON: null,
			LIKE_OF: null,
			DATA_ATUALIZACAO: null,
		},
	});

	async function obterAvisos() {
		try {
			const { data } = (await ServiceAvisos.list()).data;
			setDadosAvisos(data);
			const idEnvioStorage =
				ativarRefresh === true ? data[0]?.ID + ";" : data[0]?.ID + ";Editado";
			localStorage.setItem("viewsAviso", idEnvioStorage);
		} catch (error) {
			console.error("Error", error);
		}
	}

	useEffect(() => {
		obterAvisos();
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
						setAtivarRefresh={setAtivarRefresh}
					/>
				</Row>
			</Container>
		</>
	);
}

export default Avisos;
