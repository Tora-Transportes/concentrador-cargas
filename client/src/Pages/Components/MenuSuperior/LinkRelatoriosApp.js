import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { MdMobileFriendly, MdOutlineMobileScreenShare } from "react-icons/md";
import "../MenuSuperior/menuSuperior.css";
import "../../Relatorios/Totalizadores/indicador.css";

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
			<Container className="body-indicadorOperacional-app mt-3">
				<h1 className="title-indicadorOperacional-app">
					Indicador Operacional App-Tora:
				</h1>
				<div className="class-app-icons">
					{isPermissionPadrao && (
						<>
							<Link
								className="text-decoration-none text-center"
								to="/relatorios/app/visualizar/padrao"
							>
								<MdMobileFriendly size={70} className="icon-app-padrao" />
								<p className="link-RelatorioApp-Title-padrao">
									Carga App Padrão
								</p>
							</Link>
						</>
					)}

					{viewsCadastrarCSN && (
						<Link
							className="text-decoration-none text-center"
							to="/relatorios/app/visualizar/csn"
						>
							<MdOutlineMobileScreenShare size={70} className="icon-app-csn" />
							<p className="link-RelatorioApp-Title-CSN ">Carga App CSN</p>
						</Link>
					)}
				</div>
			</Container>
		</>
	);
}

export default LinkRelatoriosApp;
