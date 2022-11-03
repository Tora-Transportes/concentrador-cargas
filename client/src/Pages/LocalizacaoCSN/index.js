import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import { validationPermissionUser } from "../Utils/validationPermissionUser";
import dadosJsonTeste from "./testeJoson";
import ViewsLocalizacao from "./views";

const LocalizacaoCSN = () => {
	const [dadosLocalizacao, setDadosLocalizacao] = useState();
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
			setDadosLocalizacao(dadosJsonTeste?.data);
		})();
	}, []);

	return (
		<div className="main-localizacao">
			<ViewsLocalizacao dadosLocalizacao={dadosLocalizacao} />
		</div>
	);
};

export default LocalizacaoCSN;
