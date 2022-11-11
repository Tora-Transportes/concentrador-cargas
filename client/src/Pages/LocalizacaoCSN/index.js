import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ServiceCsnCargas from "src/services/ServiceCsnCargas";
import swal from "sweetalert";
import { validationPermissionUser } from "../Utils/validationPermissionUser";
import ViewsLocalizacao from "./views";

const LocalizacaoCSN = () => {
	const [dadosLocalizacao, setDadosLocalizacao] = useState();
	const [atualizarTabela, setAtualizarTabela] = useState(false);
	const history = useHistory();
	useEffect(() => {
		(async () => {
			const userPermission = await validationPermissionUser();
			if (!userPermission?.permissoes.includes("CARGAS_CSN")) {
				await swal(
					"OPS!",
					"O usuário não possui permissão para acessar esta página.",
					"warning"
				);
				history.push("/");
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const dadosLista = (await ServiceCsnCargas.list()).data.data;
			setDadosLocalizacao(dadosLista?.results);
		})();
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
