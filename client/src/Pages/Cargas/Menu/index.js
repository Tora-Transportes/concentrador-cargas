import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { MdOutlineWavingHand, MdOutlineAppRegistration } from "react-icons/md";
import { SiGooglesheets } from "react-icons/si";
import "./menuCargas.css";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
//import { validationPermissionUser } from "src/Pages/Utils/validationPermissionUser";

function Main() {
	const [viewsCadastrarCSN, setviewsCadastrarCSN] = useState(false);
	const [isPermissionPadrao, setPermissionPadrao] = useState(false);
	const { isPermissionUser } = useContext(ContextUseDefault);
	const history = useHistory();
	useEffect(() => {
		(async () => {
			//const userPermission = await validationPermissionUser();
			if (!isPermissionUser?.includes("DELETAR_CARGAS")) {
				await swal(
					"OPS!",
					"O usuário não possui permissão para acessar esta página.",
					"warning"
				);
				history.push("/");
			}

			if (isPermissionUser?.includes("CARGAS_CSN")) setviewsCadastrarCSN(true);
			if (isPermissionUser?.includes("CARGAS_PADRAO"))
				setPermissionPadrao(true);
		})();
	}, [isPermissionUser]);

	return (
		<>
			<Menusuperior type={"teste"} />
			<Container className="class-body-menu">
				<h1 id="titulo-selecionar-modo-carga" className="class-title-coleta">
					Selecione o modo no qual a carga foi coletada:
				</h1>
				<div className="class-button-icons">
					{isPermissionPadrao && (
						<>
							<Link className="text-decoration-none" to="/cargas/manual">
								<MdOutlineWavingHand size={70} id="hand" />
								<p id="title-manual">Manual</p>
							</Link>

							<Link className="text-decoration-none" to="/cargas/importar">
								<SiGooglesheets size={70} id="import" />
								<p id="title-ico-import">Importação em Lote</p>
							</Link>
						</>
					)}

					{viewsCadastrarCSN && (
						<Link className="text-decoration-none" to="/cargas/cadastro/csn">
							<MdOutlineAppRegistration size={75} id="icon-csn" />
							<p id="title-CSN">CSN</p>
						</Link>
					)}
				</div>
			</Container>
		</>
	);
}

export default Main;
