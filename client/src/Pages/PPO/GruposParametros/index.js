import React from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

import ServiceCsnCargas from "src/services/ServiceCsnCargas";
import swal from "sweetalert";
import { validationPermissionUser } from "../Utils/validationPermissionUser";
import ViewsLocalizacao from "./views";

const GruposParametros = () => {
	const { id } = useParams();
	const searchParams = new URLSearchParams(document.location.search);
	console.log(id);

	return (
		<>
			<Menusuperior />
			<Container className="pagina-produtos">
				<h1 className="class-title-produto">
					Parâmetros do Grupo : {searchParams.get("nome")}{" "}
				</h1>
			</Container>
		</>
	);
};

export default GruposParametros;
