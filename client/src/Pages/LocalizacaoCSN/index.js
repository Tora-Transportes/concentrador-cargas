import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import ServiceCsnCargas from "src/services/ServiceCsnCargas";
import swal from "sweetalert";
//import { validationPermissionUser } from "../Utils/validationPermissionUser";
import ViewsLocalizacao from "./views";

const LocalizacaoCSN = () => {
	const [dadosLocalizacao, setDadosLocalizacao] = useState();
	const [atualizarTabela, setAtualizarTabela] = useState(false);
	const { isPermissionUser } = useContext(ContextUseDefault);
	const history = useHistory();
	useEffect(() => {
		(async () => {
			//const userPermission = await validationPermissionUser();
			if (!isPermissionUser?.includes("CARGAS_CSN")) {
				await swal(
					"OPS!",
					"O usuário não possui permissão para acessar esta página.",
					"warning"
				);
				history.push("/");
			}
		})();
	}, [isPermissionUser]);

	useEffect(() => {
		(async () => {
			const dadosLista = (await ServiceCsnCargas.list()).data.data;
			setDadosLocalizacao(dadosLista?.results);
		})();
		setAtualizarTabela(false);
	}, [atualizarTabela]);

	return (
		<div className="main-localizacao">
			<ViewsLocalizacao
				dadosLocalizacao={dadosLocalizacao}
				setAtualizarTabela={setAtualizarTabela}
			/>
		</div>
	);
};

export default LocalizacaoCSN;
