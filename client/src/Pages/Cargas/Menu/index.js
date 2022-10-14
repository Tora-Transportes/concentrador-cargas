import React, { useEffect } from "react";
import "../Menu/style.css";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { MdOutlineWavingHand } from "react-icons/md";
import { SiGooglesheets } from "react-icons/si";
<<<<<<< HEAD
import "../Menu/menuCargas.css";
=======
>>>>>>> feature/bug-emergencial
// import HandleClick from "./tooltipsMenu";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { validationPermissionUser } from "src/Pages/Utils/validationPermissionUser";

function Main() {
	const history = useHistory();
	useEffect(() => {
		(async () => {
			const userPermission = await validationPermissionUser();
			if (!userPermission?.permissoes.includes("DELETAR_CARGAS")) {
				await swal(
					"OPS!",
					"O usuário não possui permissão para acessar esta pagina.",
					"warning"
				);
				history.push("/");
			}
		})();
	}, []);

	return (
		<>
			<Menusuperior type={"teste"} />
			<Container className="class-body-menu">
				<h1
					id="titulo-selecionar-modo-carga"
					className="class-title-coleta"
					// onClick={HandleClick}
				>
					Selecione o modo no qual a carga foi coletada:
				</h1>
				<div className="class-button-icons">
					<Link className="text-decoration-none" to="/cargas/manual">
						<MdOutlineWavingHand size={70} id="hand" />
						<p id="title-manual">Manual</p>
					</Link>

					<Link className="text-decoration-none" to="/cargas/importar">
						<SiGooglesheets size={70} id="import" />
						<p id="title-ico-import">Importação em lote</p>
					</Link>
				</div>
			</Container>
		</>
	);
}

export default Main;
