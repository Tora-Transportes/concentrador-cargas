import React, { useContext, useEffect, useState } from "react";
import io from "../../../services/socket";

import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import ServiceAvisos from "src/services/ServiceAvisos";
import PopUp from "./view";

function MainPopUp() {
	const [isShow, setShow] = useState(false);
	const [isLastIdPosition, setLastIdPosition] = useState();
	const [isCountAviso, setCountAviso] = useState(0);
	const { setIdAvisos } = useContext(ContextUseDefault);

	const infoAvisoLocalStorage = localStorage.getItem("viewsAviso");
	let idAvisoLocalStorage = null;
	if (infoAvisoLocalStorage)
		idAvisoLocalStorage = infoAvisoLocalStorage.split(";")[0] || null;

	useEffect(() => {
		(async () => {
			const { data } = (await ServiceAvisos.lastId()).data;
			const lastIdPosition = data?.ID;
			setLastIdPosition(lastIdPosition);
			setIdAvisos(lastIdPosition);

			const avisoEditado = infoAvisoLocalStorage.split(";")[1];
			if (idAvisoLocalStorage < lastIdPosition) {
				idAvisoLocalStorage === null ? setCountAviso("?") : "";
				setShow(true);
			} else if (avisoEditado) {
				setCountAviso("?");
				setShow(true);
			}
		})();

		const actionAvisoCreate = (payload) => {
			setShow(true);
			setLastIdPosition(payload?.ID);
		};
		const actionAvidoUpdate = async (payload) => {
			if (payload?.ID - idAvisoLocalStorage < 1) setCountAviso("?");
			setShow(true);
			const { data } = (await ServiceAvisos.lastId()).data;
			if (idAvisoLocalStorage == data?.ID)
				localStorage.setItem("viewsAviso", data?.ID + ";Editado");
		};
		io.on("@aviso-create", actionAvisoCreate);
		io.on("@aviso-update", actionAvidoUpdate);

		return () => {
			io.off("@aviso-create", actionAvisoCreate);
			io.off("@aviso-update", actionAvidoUpdate);
		};
	}, [io]);

	return (
		<>
			<PopUp
				isShow={isShow}
				setShow={setShow}
				isLastIdPosition={isLastIdPosition}
				setCountAviso={setCountAviso}
				isCountAviso={isCountAviso}
				idAvisoLocalStorage={idAvisoLocalStorage}
			/>
		</>
	);
}

export default MainPopUp;
