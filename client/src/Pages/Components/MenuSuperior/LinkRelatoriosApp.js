import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { MdMobileFriendly, MdOutlineMobileScreenShare } from "react-icons/md";
import "../../Cargas/Menu/menuCargas.css";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";

function LinkRelatoriosApp() {
	const [viewsCadastrarCSN, setviewsCadastrarCSN] = useState(false);
	const [isPermissionPadrao, setPermissionPadrao] = useState(false);
	const { isPermissionUser } = useContext(ContextUseDefault);
	useEffect(() => {
		(async () => {
			if (isPermissionUser?.includes("CARGAS_CSN")) setviewsCadastrarCSN(true);
			if (isPermissionUser?.includes("CARGAS_PADRAO"))
				setPermissionPadrao(true);
		})();
	}, [isPermissionUser]);

	return (
		<>
			<Menusuperior />
			<Container>
				<h1 id="titulo-selecionar-modo-carga" className="class-title-coleta">
					Indicador Operacional App-Tora:
				</h1>
				<div className="class-button-icons">
					{isPermissionPadrao && (
						<>
							<Link
								className="text-decoration-none"
								to="/relatorios/app/visualizar/padrao"
							>
								<MdMobileFriendly size={70} id="import" />
								<p id="title-ico-import">Carga App Padrão</p>
							</Link>
						</>
					)}

					{viewsCadastrarCSN && (
						<Link
							className="text-decoration-none text-center"
							to="/relatorios/app/visualizar/csn"
						>
							<MdOutlineMobileScreenShare size={70} id="icon-csn" />
							<p className="linck-RelatorioApp-Title-CSN ">Carga App CSN</p>
						</Link>
					)}
				</div>
			</Container>
		</>
	);
}

export default LinkRelatoriosApp;
